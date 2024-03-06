import admin, { type ServiceAccount } from "firebase-admin"
import { GoogleAuth } from "google-auth-library"
import serviceAccount from "../service-account.json"
import type { Project } from "./util"
import _ from "lodash"

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount)
})

// admin.firestore.setLogFunction(console.log)

export { admin }
export const db = admin.firestore(app)


const auth = new GoogleAuth({
    scopes: "https://www.googleapis.com/auth/cloud-platform",
    credentials: serviceAccount,
})

export async function getAccessToken() {
    const client = await auth.getClient()
    const { token } = await client.getAccessToken()
    return token
}


export async function fetchProjectsForUser(userId: string) {
    const data: Snapshot[] = await firestoreRequest(":runQuery", {
        body: {
            structuredQuery: {
                from: [{
                    collectionId: "projects"
                }],
                where: {
                    fieldFilter: {
                        field: { fieldPath: "owner" },
                        op: "EQUAL",
                        value: { stringValue: userId },
                    }
                },
            }
        }
    })

    return data
        .filter(snap => snap.document)
        .map(snap => formatDocument(snap.document!) as Project)
}


export async function fetchProject(projectId: string, mask?: string[]) {
    const document = await firestoreRequest(`projects/${projectId}`, {
        queryParams: mask ? {
            "mask.fieldPaths": mask
        } : {}
    })
    return formatDocument(document) as Project
}


export async function updateProject(projectId: string, updates: Record<string, any>) {

    // console.log("Updates:", updates)

    const updateMaskFields = Object.keys(updates)
    // had issues where the backticked props weren't getting added to the document.
    // just gonna avoid dashes in IDs for now.
    // .map(key => `\`${key}\``)

    const nestedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        _.set(acc, key, value)
        return acc
    }, {})

    const convertedUpdates = convertToFirestoreValue(nestedUpdates)

    await firestoreRequest(`projects/${projectId}`, {
        method: "PATCH",
        body: {
            fields: convertedUpdates.mapValue.fields,
        },
        queryParams: {
            "updateMask.fieldPaths": updateMaskFields,
        },
    })
}


export async function addSignup(projectId: string, email: string) {

    const newDoc = convertToFirestoreValue({
        email,
        projectId,
    })

    const documentId = `${projectId}_${email}`.replaceAll(/\W+/g, "_")

    await firestoreRequest(`signups`, {
        method: "POST",
        body: {
            fields: newDoc.mapValue.fields,
        },
        queryParams: {
            documentId,
        }
    })
}


export async function createProject(name: string, owner: string) {

    const newDocData = convertToFirestoreValue({
        owner,
        name,
        colors: {
            primary: "#000000",
        },
    })

    const newDoc = await firestoreRequest(`projects`, {
        method: "POST",
        body: {
            fields: newDocData.mapValue.fields,
        },
    })

    const { id } = formatDocument(newDoc as Document)
    return id
}


export async function deleteProject(projectId: string) {
    await firestoreRequest(`projects/${projectId}`, {
        method: "DELETE",
    })
}


async function firestoreRequest(path: string, {
    body,
    method = body ? "POST" : "GET",
    queryParams = {}
}: FirestoreRequestOptions = {}) {

    console.log("Firestore Request:", method, fullName(path), queryParams, body)

    const url = new URL(`https://firestore.googleapis.com/v1/${fullName(path)}`)

    Object.entries(queryParams).forEach(([key, val]) => {
        if (Array.isArray(val))
            val.forEach(v => url.searchParams.append(key, v))
        else
            url.searchParams.append(key, val)
    })

    return fetch(url.toString(), {
        method,
        headers: {
            "Authorization": `Bearer ${await getAccessToken()}`,
            "Content-Type": "application/json",
        },
        ...body && { body: JSON.stringify(body) },
    }).then(handleJsonResponse)
}

type FirestoreRequestOptions = {
    body?: any
    method?: "GET" | "POST" | "PATCH" | "DELETE"
    queryParams?: Record<string, string | string[]>
}


function convertToFirestoreValue(value: any): any {
    if (Array.isArray(value))
        return { arrayValue: { values: value.map(convertToFirestoreValue) } }

    if (value === null) {
        return { nullValue: null }
    }

    if (typeof value === "object")
        return {
            mapValue: {
                fields: Object.fromEntries(
                    Object.entries(value)
                        .filter(([_, val]) => val !== undefined)
                        .map(([key, val]) => [key, convertToFirestoreValue(val)])
                )
            }
        }

    if (typeof value === "number")
        return { integerValue: value }

    if (typeof value === "boolean")
        return { booleanValue: value }

    return { stringValue: value }
}


async function handleJsonResponse(res: Response) {
    if (res.ok)
        return res.json()

    const response = await res.json()
    console.error(response.error)
    throw new FirestoreError(response.error)
}


export class FirestoreError extends Error {
    code: number
    status: string
    constructor(response: { code: number, message: string, status: string }) {
        super(response.message)
        this.code = response.code
        this.status = response.status
    }
}


function formatDocument(document: Document): FormattedDocument {
    return {
        id: document.name.split("/").pop(),
        ...cleanField(document.fields, true),
        _meta: {
            path: document.name,
            createTime: new Date(document.createTime),
            updateTime: new Date(document.updateTime),
        },
    }
}


function cleanField(field: any, treatAsMap = false) {
    if (!field)
        return field

    if (field.arrayValue) {
        return field.arrayValue.values?.map((field: any) => cleanField(field)) ?? []
    }

    if (treatAsMap)
        field = { mapValue: { fields: field } }

    if (field.mapValue) {
        return Object.fromEntries(
            Object.entries(field.mapValue.fields ?? {}).map(([key, value]): [string, any] => [key, cleanField(value)])
        )
    }

    return Object.values(field)[0]
}


function fullName(path?: string) {
    const isVerb = path?.startsWith(":")
    return `projects/${serviceAccount.project_id}/databases/(default)/documents${(isVerb || !path) ? "" : "/"}${path || ""}`
}


type Snapshot = {
    readTime: string
    document?: Document
}

type Document = {
    name: string
    fields: any
    createTime: string
    updateTime: string
}

export type FormattedDocument = {
    id: string
    _meta: {
        path: string
        createTime: Date
        updateTime: Date
    }
} & Record<string, any>