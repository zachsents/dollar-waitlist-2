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
import { admin, fetchProject, fetchProjectsForUser, updateProject } from "./server-modules/firebase"
import { SettingsTabs, createUpdatesForForm, encodeImage, stripeHeaders } from "./server-modules/util"


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))
app.use(express.static(path.join(import.meta.path, "../public")))


app.post("/api/login", async (req: Request, res: Response) => {
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
})

app.get("/logout", async (_, res: Response) => {
    res.clearCookie("session")
    res.redirect("/login")
})

app.get("/api/user/displayName", authenticate(), async (req: Request, res: Response) => {
    const user = (req as AuthenticatedRequest).currentUser
    const displayName = user.name || user.email

    res.format({
        html: () => res.send(displayName),
        json: () => res.json({ displayName }),
    })
})

app.get("/api/projects/:projectId/name", authenticate(), async (req: Request, res: Response) => {
    const project = await fetchProject(req.params.projectId, ["name"])
    res.format({
        html: () => res.send(project.name),
        json: () => res.json({ name: project.name }),
    })
})

app.get("/api/projects", authenticate(), async (req: Request, res: Response) => {

    const user = (req as AuthenticatedRequest).currentUser
    const projects = await fetchProjectsForUser(user.uid)

    res.format({
        html: renderSnippet("project-card-list", { projectList: projects }, res),
        json: () => {
            res.json({ projects })
        },
    })
})

app.post("/projects/:projectId/settings/:tab", authenticate(), async (req: Request, res: Response) => {

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
})


app.get("/projects/:projectId/signup", async (req: Request, res: Response) => {
    const data = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: stripeHeaders,
        body: new URLSearchParams({
            "line_items[0][price]": "price_1Or62aHYINHn5cdTih9cTyTH",
            "line_items[0][quantity]": "1",
            "metadata[projectId]": req.params.projectId,
            "mode": "payment",
            "success_url": `http://${req.headers.host}/projects/${req.params.projectId}/successfulsignup?id={CHECKOUT_SESSION_ID}`,
        }).toString()
    }).then(response => response.json())

    if (data.error) {
        console.error(data.error)
        res.sendStatus(500)
        return
    }

    res.redirect(data.url)
})

app.get("/projects/:projectId/successfulsignup", async (req: Request, res: Response) => {

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

    // TO DO: store signup

    res.send(`<script>window.onload = () => { localStorage.setItem("dwsignup-${projectId}", "${email}"); window.location.href = "/projects/${projectId}" }</script>`)
})


// Redirects
app.get("/", (_, res: Response) => res.redirect("/projects"))
app.get(
    "/projects/:projectId/settings",
    (req: Request, res: Response) => res.redirect(`/projects/${req.params.projectId}/settings/general`)
)

// Pages requiring authentication
app.get("/projects", authenticate(), renderPage())
app.get(
    "/projects/:projectId/settings/:tab",
    authenticate(),
    (req: Request, res: Response, next: NextFunction) => {
        const { success } = z.nativeEnum(SettingsTabs).safeParse(req.params.tab)
        success ? next() : res.sendStatus(404)
    },
    renderPage("edit-project")
)

// Pages not requiring authentication
app.get("/login", requireNotLoggedIn, renderPage())
app.get("/projects/:projectId", renderPage("view-waitlist"))

// Catch-all
app.get("/*", renderPage())


const port = 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


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
            rid, req
        }))

        res.send(pageHtml)
    }
}


function authenticate() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const claims = await admin.auth().verifySessionCookie(req.cookies.session || "", true);
            (req as AuthenticatedRequest).currentUser = claims
            console.log(`Authenticated as: ${claims.name || claims.email} (${claims.uid})`)
            next()
        } catch (err) {
            if (req.header("HX-Request")) {
                res.header("HX-Redirect", "/login")
                res.sendStatus(401)
            }
            else
                res.redirect("/login")
        }
    }
}


async function requireNotLoggedIn(req: Request, res: Response, next: NextFunction) {
    try {
        await admin.auth().verifySessionCookie(req.cookies.session || "", true)
        res.redirect("/")
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


interface AuthenticatedRequest extends Request {
    currentUser: DecodedIdToken
}