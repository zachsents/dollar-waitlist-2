import type { Request } from "express"
import _ from "lodash"
import type { FormattedDocument } from "./firebase"
import type { File } from "formidable"
import sharp from "sharp"

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
}


export type Project = {
    owner: string
    name: string
    logo: string
    onlyShowLogo: boolean
    maxSignupCount: number
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
        features: {
            title: string
            description: string
            icon: string
            order: number
        }[]
        otherFeatures: string[]
        benefits: {
            title: string
            description: string
            icon: string
            order: number
        }[]
        tweets: string[]
        team: {
            name: string
            title: string
            badges: string[]
            twitter: string
            linkedin: string
            avatar: string
            order: number
        }[]
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


export async function encodeImage(file: File) {
    const fileBuffer = await Bun.file(file.filepath).arrayBuffer()

    if (file.mimetype === "text/svg+xml") {
        return await sharp(fileBuffer)
            .resize({ height: 300, withoutEnlargement: true })
            .toBuffer()
            .then(buf => `data:text/svg+xml;base64, ${buf.toString("base64")}`)
    }

    return await sharp(fileBuffer)
        .resize({ height: 300, withoutEnlargement: true })
        .webp()
        .toBuffer()
        .then(buf => `data:image/webp;base64, ${buf.toString("base64")}`)
}