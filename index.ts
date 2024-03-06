/// <reference types="@kitajs/html/htmx.d.ts" />
import { Html } from "@kitajs/html"
import "@kitajs/html/register"
import { renderToString } from "@kitajs/html/suspense"
import cookieParser from "cookie-parser"
import express, { type NextFunction, type Request, type Response } from "express"
import type { DecodedIdToken } from "firebase-admin/auth"
import formidable from "formidable"
import _ from "lodash"
import morgan from "morgan"
import path from "path"
import { z } from "zod"
import { FirestoreError, addSignup, admin, createProject, deleteProject, exportSignups, fetchProject, fetchProjectsForUser, requestPayout, updateProject } from "./server-modules/firebase"
import { SettingsTabs, createUpdatesForForm, encodeImage, stripeHeaders, type AuthenticatedRequest } from "./server-modules/util"


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(express.static(path.join(import.meta.path, "../public")))


app.get("/", (_, res: Response) => res.redirect("/projects/dollar-waitlist"))
app.get(["/dashboard", "/app", "/waitlists"], (_, res: Response) => res.redirect("/projects"))


/* -------------------------------------------------------------------------- */
/*                                Login/Logout                                */
/* -------------------------------------------------------------------------- */

app.get("/login", requireNotLoggedIn, renderPage())

app.post("/api/login",
    async (req: Request, res: Response) => {
        const idToken = req.body.idToken
        const csrfToken = req.body.csrfToken

        if (csrfToken !== req.cookies.csrfToken) {
            res.sendStatus(401)
            return
        }

        const claims = await admin.auth().verifyIdToken(idToken)
        res.cookie("lastLogin", claims.email)

        const expiresIn = 60 * 60 * 24 * 5 * 1000
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn })
        res.cookie("session", sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: true
        })

        res.sendStatus(200)
    }
)

app.get("/logout",
    async (_, res: Response) => {
        res.clearCookie("session")
        res.redirect("/")
    }
)


/* -------------------------------------------------------------------------- */
/*                              Project Settings                              */
/* -------------------------------------------------------------------------- */

app.get("/projects/:projectId/settings",
    (req: Request, res: Response) => res.redirect(`/projects/${req.params.projectId}/settings/general`)
)

app.get("/projects/:projectId/settings/:tab", authenticate({ forProject: true }),
    (req: Request, res: Response, next: NextFunction) => {
        const { success } = z.nativeEnum(SettingsTabs).safeParse(req.params.tab)
        success ? next() : res.sendStatus(404)
    },
    renderPage("edit-project")
)

app.post("/projects/:projectId/settings/:tab", authenticate({ forProject: true }),
    async (req: Request, res: Response) => {

        const formParser = formidable({
            multiples: true,
        })

        const [fields, files] = await formParser.parse(req)
        // console.log(fields, Object.keys(files))

        const selectFirstInFields = (...fieldNames: string[]) => _.omitBy(
            _.mapValues(
                _.pick(fields, ...fieldNames),
                value => Array.isArray(value) ? value[0] : value
            ),
            _.isNil
        )

        switch (req.params.tab) {
            case SettingsTabs.General:
                await updateProject(req.params.projectId, {
                    ...selectFirstInFields("name", "colors.primary"),
                    onlyShowLogo: Boolean(fields.onlyShowLogo?.[0]),
                    ...files.logo && {
                        logo: await encodeImage(files.logo[0]),
                    },
                    liveSiteUrl: fields.liveSiteUrl?.[0] || null,
                })
                break
            case SettingsTabs.Theme: break
            case SettingsTabs.Signups:
                const hasSignupGoal = Boolean(fields.signupGoal?.[0])
                await updateProject(req.params.projectId, {
                    hasSignupGoal,
                    signupGoal: hasSignupGoal ?
                        parseInt(fields.signupGoal?.toString() ?? "0") :
                        null,
                    allowOverflowSignups: Boolean(fields.allowOverflowSignups?.[0]),
                    webhookUrl: fields.webhookUrl?.[0] || null,
                })
                break
            case SettingsTabs.Hero:
                await updateProject(req.params.projectId, selectFirstInFields(
                    "content.headline",
                    "content.description",
                    "content.eyebrow",
                ))
                break
            case SettingsTabs.Features:
                const featureUpdates = await createUpdatesForForm({
                    fields,
                    files,
                    extractId: key => key.match(/(?<=content\.features\.)\w+/)?.[0] ?? "",
                    databaseKey: "content.features",
                    projectId: req.params.projectId,
                    simpleKeys: ["title", "description", "icon", "gradientColor"],
                    booleanKeys: ["addGradient"],
                    imageKeys: ["image"],
                    imageResize: 500,
                })
                await updateProject(req.params.projectId, {
                    ...featureUpdates,
                    "content.otherFeatures": fields["content.otherFeatures"]?.[0].split("\n")
                        .map(line => line.trim()).filter(Boolean) ?? [],
                })
                break
            case SettingsTabs.Benefits:
                if (!fields["content.benefits"])
                    return res.sendStatus(400)

                await updateProject(req.params.projectId, {
                    "content.benefits": Object.fromEntries(
                        fields["content.benefits"]!.map((value, i) => {
                            const parsed = JSON.parse(value)
                            parsed.order = i
                            return [parsed.id, parsed]
                        })
                    )
                })
                break
            case SettingsTabs.Tweets:
                await updateProject(req.params.projectId, {
                    "content.tweets": fields["content.tweets"]?.[0].split("\n")
                        .map(line => line.trim()).filter(Boolean) ?? [],
                })
                break
            case SettingsTabs.Team:
                await updateProject(req.params.projectId, await createUpdatesForForm({
                    fields,
                    files,
                    extractId: key => key.match(/(?<=content\.team\.)\w+/)?.[0] ?? "",
                    databaseKey: "content.team",
                    projectId: req.params.projectId,
                    simpleKeys: ["name", "title", "twitter", "linkedin"],
                    splitKeys: ["badges"],
                    imageKeys: ["avatar"],
                }))
                break
            default:
                return res.sendStatus(404)
        }

        res.sendStatus(204)
    }
)

app.post("/projects", authenticate(),
    async (req: Request, res: Response) => {

        const projectName = req.header("HX-Prompt")?.trim()
        if (!projectName)
            return res.sendStatus(400)

        const projectId = await createProject(projectName, (req as AuthenticatedRequest).currentUser.uid)
        res.header("HX-Redirect", `/projects/${projectId}/settings`)
        res.sendStatus(204)
    }
)

app.delete("/projects/:projectId", authenticate({ forProject: true }),
    async (req: Request, res: Response) => {
        await deleteProject(req.params.projectId)
        res.header("HX-Redirect", `/projects`)
        res.sendStatus(204)
    }
)

app.post("/projects/:projectId/payouts", authenticate({ forProject: true }),
    async (req: Request, res: Response) => {
        await requestPayout(req.params.projectId)
        res.format({
            html: renderSnippet("edit-project-form/payouts", {
                projectId: req.params.projectId
            }, res),
        })
    },
)


/* -------------------------------------------------------------------------- */
/*                               Project Signups                              */
/* -------------------------------------------------------------------------- */

app.get("/projects/:projectId/signup",
    async (req: Request, res: Response) => {
        const data = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: stripeHeaders,
            body: new URLSearchParams({
                "line_items[0][price]": "price_1Or62aHYINHn5cdTih9cTyTH",
                "line_items[0][quantity]": "1",
                "metadata[projectId]": req.params.projectId,
                "mode": "payment",
                "success_url": `http://${req.headers.host}/projects/${req.params.projectId}/successfulsignup?session_id={CHECKOUT_SESSION_ID}`,
            }).toString()
        }).then(response => response.json())

        if (data.error) {
            console.error(data.error)
            res.sendStatus(500)
            return
        }

        res.redirect(data.url)
    }
)

app.get("/projects/:projectId/successfulsignup",
    async (req: Request, res: Response) => {

        const sessionId = req.query.session_id

        if (!sessionId) {
            res.sendStatus(400)
            return
        }

        const sessionData = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
            method: "GET",
            headers: stripeHeaders,
        }).then(response => response.json())

        if (sessionData.error) {
            console.error(sessionData.error)
            res.sendStatus(500)
            return
        }

        const projectId = sessionData.metadata.projectId
        const email = sessionData.customer_details?.email || sessionData.customer_email

        try {
            await addSignup(projectId, email, sessionId as string, sessionData.amount_total)

            const project = await fetchProject(projectId, ["webhookUrl"])
            if (project.webhookUrl) {
                // potentially unsafe for serverless but i don't want
                // to wait for some random server to respond
                fetch(project.webhookUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, projectId }),
                })
            }
        }
        catch (err) {
            if (!(err instanceof FirestoreError && err.code == 409)) {
                res.sendStatus(500)
                return
            }
            console.debug(`Signup already exists for ${email} on project ${projectId}, continuing`)
        }

        res.send(`<script>window.onload = () => { localStorage.setItem("dwsignup-${projectId}", "${email}"); window.location.href = "/projects/${projectId}" }</script>`)
    }
)

app.get("/projects/:projectId/signups", authenticate({ forProject: true }),
    async (req: Request, res: Response) => {

        const { success, data: mode }: any = z.enum(["json", "csv"])
            .default("json")
            .safeParse(req.query.format)

        if (!success)
            return res.sendStatus(400)

        if (mode === "json")
            res.header("Content-Type", "application/json")
        else if (mode === "csv")
            res.header("Content-Type", "text/csv")

        if ("download" in req.query)
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="signups-${req.params.projectId}.${mode}"`
            )

        res.send(await exportSignups(req.params.projectId, mode))
    }
)


/* -------------------------------------------------------------------------- */
/*                                 Other Pages                                */
/* -------------------------------------------------------------------------- */

app.get("/projects", authenticate(), renderPage())

app.get("/projects/:projectId", authenticate({ optional: true }), renderPage("view-waitlist"))


/* -------------------------------------------------------------------------- */
/*                                  Snippets                                  */
/* -------------------------------------------------------------------------- */

app.get("/api/projects", authenticate(),
    async (req: Request, res: Response) => {

        const user = (req as AuthenticatedRequest).currentUser
        const projects = await fetchProjectsForUser(user.uid)

        res.format({
            html: renderSnippet("project-card-list", { projectList: projects }, res),
            json: () => {
                res.json({ projects })
            },
        })
    }
)

app.get("/api/user/displayName", authenticate(),
    async (req: Request, res: Response) => {
        const user = (req as AuthenticatedRequest).currentUser
        const displayName = user.name || user.email

        res.format({
            html: () => res.send(displayName),
            json: () => res.json({ displayName }),
        })
    }
)

app.get("/api/projects/:projectId/name", authenticate({ forProject: true }),
    async (req: Request, res: Response) => {
        const project = await fetchProject(req.params.projectId, ["name"])
        res.format({
            html: () => res.send(project.name),
            json: () => res.json({ name: project.name }),
        })
    }
)


// Catch-all
app.get("/*", renderPage())


/* -------------------------------------------------------------------------- */
/*                                  App Setup                                 */
/* -------------------------------------------------------------------------- */

const port = 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


/* -------------------------------------------------------------------------- */
/*                                 Middlewares                                */
/* -------------------------------------------------------------------------- */

function renderPage(pagePath?: string) {
    return async (req: Request, res: Response) => {
        pagePath ??= req.path.replace(/^\//, "")

        let page: any
        try {
            page = require(`./pages/${pagePath}`).default
        }
        catch (err: any) {
            if (err.code === "MODULE_NOT_FOUND") {
                res.sendStatus(404)
                return
            }
            console.error(err)
        }

        res.setHeader("Content-Type", "text/html; charset=utf-8")

        console.debug(`Rendering page: /${pagePath}`)

        const pageHtml = await renderToString(rid => Html.createElement(page, {
            rid, req, res
        }))

        res.send(pageHtml)
    }
}


function authenticate({
    optional = false,
    redirectTo = "/login",
    asUser,
    forProject,
}: AuthenticateMiddlewareOptions = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {

        const claims: DecodedIdToken | false = await admin.auth()
            .verifySessionCookie(req.cookies.session || "", true)
            .catch(() => false)

        if (!claims) {
            if (optional)
                return next()

            if (req.header("HX-Request")) {
                res.header("HX-Redirect", redirectTo)
                res.sendStatus(401)
                return
            }

            return res.redirect(redirectTo)
        }

        if (asUser && claims.uid !== asUser)
            return res.sendStatus(403)

        if (forProject) {
            const projectId = typeof forProject === "string" ? forProject : req.params.projectId
            const project = await fetchProject(projectId, ["owner"])
            if (project.owner !== claims.uid)
                return res.sendStatus(403)
        }

        (req as AuthenticatedRequest).currentUser = claims
        console.log(`Authenticated as: ${claims.name || claims.email} (${claims.uid})`)
        next()
    }
}

type AuthenticateMiddlewareOptions = {
    optional?: boolean
    redirectTo?: string
    asUser?: string
    forProject?: boolean | string
}


async function requireNotLoggedIn(req: Request, res: Response, next: NextFunction) {
    try {
        await admin.auth().verifySessionCookie(req.cookies.session || "", true)
        res.redirect("/projects")
    }
    catch (err) {
        next()
    }
}


function renderSnippet(componentName: string, props: any, res: Response) {
    return async () => {
        try {
            const component = require(`./components/${componentName}`).default
            const snippet = await renderToString(() => Html.createElement(component, props))
            res.send(snippet)
        }
        catch (err: any) {
            console.error(err)
            res.sendStatus(err.code === "MODULE_NOT_FOUND" ? 404 : 500)
        }
    }
}
