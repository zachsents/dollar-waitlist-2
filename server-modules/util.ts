import type { Request } from "express"
import type { FormattedDocument } from "./firebase"
import _ from "lodash"

export function evfn(fn: (event: Event, element: HTMLElement) => void): string {
    return `(${fn.toString()})(event, this)`
}

export function randomId(prefix?: string) {
    return `${prefix || ""}${Math.random().toString(36).substring(2, 10)}`
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
        }[]
        otherFeatures: string[]
        benefits: {
            title: string
            description: string
            icon: string
        }[]
        tweets: string[]
        team: {
            name: string
            title: string
            badges: string[]
            twitter: string
            linkedin: string
            avatar: string
        }[]
    }
} & FormattedDocument


export type SettingsProps = {
    project: Project
    req: Request
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
}


export function cgen(...args: any[]): string {
    return args.reduce((acc, arg) => {
        if (typeof arg === "object" && "class" in arg)
            arg = arg.class

        return Boolean(arg) ? `${acc} ${arg}` : acc
    }, "")
}