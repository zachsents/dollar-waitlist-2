import admin, { type ServiceAccount } from "firebase-admin"
import { GoogleAuth } from "google-auth-library"
import serviceAccount from "../service-account.json"
import { PayoutStatus, formatDollars, type Project } from "./util"
import _ from "lodash"
import Papa from "papaparse"
import crypto from "crypto"


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

    console.debug("Converted updates", JSON.stringify(convertedUpdates, null, 2))
    console.debug("Masks", updateMaskFields)

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


export async function addSignup(projectId: string, email: string, stripeCheckoutSessionId: string, paymentAmount: number) {
    await firestoreRequest("signups", {
        method: "POST",
        body: {
            fields: convertToFirestoreValue({
                email,
                projectId,
                stripeCheckoutSessionId,
                paymentAmount,
            }).mapValue.fields,
        },
        queryParams: {
            documentId: crypto.createHash("sha256")
                .update(stripeCheckoutSessionId)
                .digest("base64url"),
        },
    })
}

export async function fetchSignupCount(projectId: string) {
    const data = await firestoreRequest(":runAggregationQuery", {
        body: {
            structuredAggregationQuery: {
                aggregations: [{
                    count: {},
                }],
                structuredQuery: {
                    from: [{
                        collectionId: "signups"
                    }],
                    where: {
                        fieldFilter: {
                            field: { fieldPath: "projectId" },
                            op: "EQUAL",
                            value: { stringValue: projectId },
                        }
                    }
                }
            }
        }
    })

    return data[0].result.aggregateFields.field_1.integerValue
}


export async function exportSignups(projectId: string, mode?: "csv" | "json" | "js") {

    const data: Snapshot[] = await firestoreRequest(":runQuery", {
        body: {
            structuredQuery: {
                from: [{
                    collectionId: "signups"
                }],
                where: {
                    fieldFilter: {
                        field: { fieldPath: "projectId" },
                        op: "EQUAL",
                        value: { stringValue: projectId },
                    }
                },
            }
        }
    })

    const formattedData = data
        .filter(snap => snap.document)
        .map(snap => ({
            email: snap.document!.fields.email.stringValue,
            create_time: snap.document!.createTime,
        }))

    if (mode === "js")
        return formattedData

    if (mode === "json")
        return JSON.stringify(formattedData)

    if (mode === "csv")
        return Papa.unparse(formattedData)
}


export async function fetchPayouts(projectId: string) {
    const data: Snapshot[] = await firestoreRequest(":runQuery", {
        body: {
            structuredQuery: {
                from: [{
                    collectionId: "payouts"
                }],
                where: {
                    fieldFilter: {
                        field: { fieldPath: "projectId" },
                        op: "EQUAL",
                        value: { stringValue: projectId },
                    }
                },
            }
        }
    })

    return data
        .filter(snap => snap.document)
        .map(snap => formatDocument(snap.document!))
}


export async function fetchCurrentBalance(projectId: string) {
    const [signupsTotal, payoutsTotal] = await Promise.all([
        firestoreRequest(":runAggregationQuery", {
            body: {
                structuredAggregationQuery: {
                    aggregations: [{
                        sum: {
                            field: { fieldPath: "paymentAmount" },
                        },
                    }],
                    structuredQuery: {
                        from: [{
                            collectionId: "signups"
                        }],
                        where: {
                            fieldFilter: {
                                field: { fieldPath: "projectId" },
                                op: "EQUAL",
                                value: { stringValue: projectId },
                            }
                        }
                    }
                }
            }
        }).then(data => data[0].result.aggregateFields.field_1.integerValue),

        firestoreRequest(":runAggregationQuery", {
            body: {
                structuredAggregationQuery: {
                    aggregations: [{
                        sum: {
                            field: { fieldPath: "amount" },
                        },
                    }],
                    structuredQuery: {
                        from: [{
                            collectionId: "payouts"
                        }],
                        where: {
                            compositeFilter: {
                                op: "AND",
                                filters: [{
                                    fieldFilter: {
                                        field: { fieldPath: "projectId" },
                                        op: "EQUAL",
                                        value: { stringValue: projectId },
                                    }
                                }, {
                                    fieldFilter: {
                                        field: { fieldPath: "status" },
                                        op: "EQUAL",
                                        value: { stringValue: PayoutStatus.Paid },
                                    }
                                }]
                            }
                        }
                    }
                }
            }
        }).then(data => data[0].result.aggregateFields.field_1.integerValue),
    ])

    return signupsTotal - payoutsTotal
}


export async function requestPayout(projectId: string) {
    const currentBalance = await fetchCurrentBalance(projectId)

    const newDoc = await firestoreRequest("payouts", {
        method: "POST",
        body: {
            fields: convertToFirestoreValue({
                projectId,
                status: PayoutStatus.Requested,
                amount: currentBalance,
            }).mapValue.fields,
        },
    })

    const { id: payoutId } = formatDocument(newDoc as Document)

    await fetch(process.env.SEND_PAYOUT_REQUEST_URL as string, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            projectId,
            payoutId,
            amount: currentBalance,
            formattedAmount: formatDollars(currentBalance, true),
        }),
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

    // console.log("Firestore Request:", method, fullName(path), queryParams, body)

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
    console.error(response)
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