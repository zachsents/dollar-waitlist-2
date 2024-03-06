import type { Request, Response } from "express"
import _ from "lodash"
import { fetchProject, type FormattedDocument } from "./firebase"
import type { Fields, File, Files } from "formidable"
import sharp from "sharp"
import numeral from "numeral"
import type { DecodedIdToken } from "firebase-admin/auth"

export function evfn(fn: (event: Event, element: HTMLElement) => void): string {
    return `(${fn.toString()})(event, this)`
}

export function randomId(prefix?: string, withDash = true) {
    const rand = Math.random().toString(36).substring(2, 10)
    return `${prefix ? withDash ? `${prefix}-` : prefix : ""}${rand}`
}

export type PageProps = {
    rid: string
    req: Request
    res: Response
}


export type ProjectFeature = {
    title: string
    description: string
    icon: string
    order: number
    addGradient: boolean
    gradientColor: string
    image: string
}


export type ProjectBenefit = {
    title: string
    description: string
    icon: string
    order: number
}

export type ProjectTeamMember = {
    name: string
    title: string
    badges: string[]
    twitter: string
    linkedin: string
    avatar: string
    order: number
}

export type Project = {
    owner: string
    name: string
    logo: string
    onlyShowLogo: boolean
    signupGoal: number
    hasSignupGoal: boolean
    signupCount: number
    allowOverflowSignups: boolean
    colors: {
        primary: string
        secondary: string
    }
    content: {
        headline: string
        description: string
        eyebrow: string
        features: Record<string, ProjectFeature>
        otherFeatures: string[]
        benefits: Record<string, ProjectBenefit>
        tweets: string[]
        team: Record<string, ProjectTeamMember>
    }
} & FormattedDocument


export type SettingsProps = {
    projectId: string
}

export type HTMXMode = "self" | "parent" | "ancestor"

export const htmxClasses: Record<HTMXMode, { flex: string, hidden: string }> = {
    self: {
        flex: "[&.htmx-request]:flex",
        hidden: "[&.htmx-request]:hidden",
    },
    parent: {
        flex: "[.htmx-request>&]:flex",
        hidden: "[.htmx-request>&]:hidden",
    },
    ancestor: {
        flex: "[.htmx-request_&]:flex",
        hidden: "[.htmx-request_&]:hidden",
    },
}


export function alpineJsonStringify(obj: any) {
    return JSON.stringify(_.mapValues(obj, v => v || ""))
        .replaceAll(/"js:(.+?)(?<!\\)"/g, "$1")
}


export function cc(component: Function, sub?: string) {
    return `component--${component.name}${sub ? `--${sub}` : ""}`
}

export function cgen(...args: any[]): string {
    return args.reduce((acc: string, arg) => {
        if (typeof arg === "function" && /^[A-Z]/.test(arg.name))
            arg = cc(arg)

        if (Array.isArray(arg))
            arg = cgen(...arg)

        if (typeof arg === "object" && arg != null)
            arg = ("class" in arg) ? arg.class : null

        return Boolean(arg) ? `${acc} ${arg}`.trim() : acc
    }, "")
}

export function addProps(htmlStr: string | string[], props: Record<string, any>): string | string[] {
    if (Array.isArray(htmlStr)) {
        return htmlStr.map(str => addProps(str, props)) as string[]
    }

    return htmlStr.replace(
        /^<(\w+)(\s+[^>]+)?>/,
        `<$1$2 ${Object.entries(props).map(([k, v]) => `${k}="${v}"`).join(" ")}>`
    )
}

export enum SettingsTabs {
    General = "general",
    Theme = "theme",
    Signups = "signups",
    Hero = "hero",
    Features = "features",
    Benefits = "benefits",
    Tweets = "tweets",
    Team = "team",
}

export const settingsTabLabels = {
    [SettingsTabs.General]: "General",
    [SettingsTabs.Theme]: "Theme",
    [SettingsTabs.Signups]: "Signups",
    [SettingsTabs.Hero]: "Hero",
    [SettingsTabs.Features]: "Features",
    [SettingsTabs.Benefits]: "Benefits",
    [SettingsTabs.Tweets]: "Tweets",
    [SettingsTabs.Team]: "Team",
}


export async function encodeImage(file: File, resize: number = 300) {
    const fileBuffer = await Bun.file(file.filepath).arrayBuffer()

    if (file.mimetype === "text/svg+xml") {
        return await sharp(fileBuffer)
            .resize({ height: 300, withoutEnlargement: true })
            .toBuffer()
            .then(buf => `data:text/svg+xml;base64, ${buf.toString("base64")}`)
    }

    return await sharp(fileBuffer)
        .resize({ height: resize, withoutEnlargement: true })
        .webp({ nearLossless: true })
        .toBuffer()
        .then(buf => `data:image/webp;base64, ${buf.toString("base64")}`)
}


export function selectFirstInFields(fields: Fields<string>, ...fieldNames: string[]) {
    return _.omitBy(
        _.mapValues(
            _.pick(fields, ...fieldNames),
            value => Array.isArray(value) ? value[0] : value
        ),
        _.isNil
    )
}


export async function createUpdatesForForm(options: {
    fields: Fields<string>,
    files: Files<string>,
    extractId: (key: string) => string,
    projectId: string,
    databaseKey: string,
    simpleKeys?: string[],
    splitKeys?: string[],
    imageKeys?: string[],
    booleanKeys?: string[],
    imageResize?: number,
}) {

    const includedIds = new Set(
        Object.keys(options.fields)
            .map(options.extractId)
            .filter(Boolean)
    )

    const orderUpdates = Object.fromEntries(
        [...includedIds].map((id, i) => [`${options.databaseKey}.${id}.order`, i])
    )

    const imageUpdates = options.imageKeys && Object.fromEntries(
        await Promise.all(
            [...includedIds]
                .flatMap(id => options.imageKeys!.map(k => `${options.databaseKey}.${id}.${k}`))
                .filter(imageKey => imageKey in options.files)
                .map(
                    imageKey => encodeImage(options.files[imageKey]![0], options.imageResize)
                        .then(avatar => [imageKey, avatar])
                )
        )
    )

    const currentProject = await fetchProject(options.projectId, [options.databaseKey])
    const currentIds = new Set(Object.keys(_.get(currentProject, options.databaseKey) || {}))
    const deletions = Object.fromEntries(
        [...currentIds].filter(id => !includedIds.has(id))
            .map(id => [`${options.databaseKey}.${id}`, undefined])
    )

    return {
        ...options.simpleKeys && selectFirstInFields(
            options.fields,
            ...Object.keys(options.fields)
                .filter(key => options.simpleKeys!.some(k => key.endsWith(k)))
        ),
        ...options.splitKeys && _.mapValues(
            selectFirstInFields(
                options.fields,
                ...Object.keys(options.fields)
                    .filter(key => options.splitKeys!.some(k => key.endsWith(k)))
            ),
            (value: string) => value.split("\n").map(line => line.trim()).filter(Boolean)
        ),
        ...options.booleanKeys && _.mapValues(
            selectFirstInFields(
                options.fields,
                ...Object.keys(options.fields)
                    .filter(key => options.booleanKeys!.some(k => key.endsWith(k)))
            ),
            value => Boolean(value)
        ),
        ...orderUpdates,
        ...imageUpdates,
        ...deletions,
    }
}

export function formatNumber(num: number) {
    if (num == null)
        return ""

    return numeral(num).format("0.0a")
        .replace(".0", "")
}


export const stripeHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Authorization": "Basic " + Buffer.from(`${process.env.STRIPE_API_KEY}:`).toString("base64"),
}


export interface AuthenticatedRequest extends Request {
    currentUser: DecodedIdToken
}