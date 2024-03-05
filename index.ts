/// <reference types="@kitajs/html/htmx.d.ts" />
import { Html } from "@kitajs/html"
import "@kitajs/html/register"
import { renderToString } from "@kitajs/html/suspense"
import cookieParser from "cookie-parser"
import express, { type NextFunction, type Request, type Response } from "express"
import type { DecodedIdToken } from "firebase-admin/auth"
import formidable, { type File } from "formidable"
import _ from "lodash"
import morgan from "morgan"
import path from "path"
import sharp from "sharp"
import { z } from "zod"
import { admin, fetchProject, fetchProjectsForUser, updateProject } from "./server-modules/firebase"
import { SettingsTabs, encodeImage } from "./server-modules/util"


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
    console.log(fields, Object.keys(files))

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
                onlyShowLogo: Boolean(fields.onlyShowLogo),
                ...files.logo && {
                    logo: await encodeImage(files.logo[0]),
                },
            })
            break
        case SettingsTabs.Theme: break
        case SettingsTabs.Signups:
            await updateProject(req.params.projectId, {
                signupGoal: parseInt(fields.signupGoal?.toString() ?? "0"),
                allowOverflowSignups: Boolean(fields.allowOverflowSignups),
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
            if (!fields["content.features"])
                return res.sendStatus(400)

            await updateProject(req.params.projectId, {
                "content.features": Object.fromEntries(
                    fields["content.features"]!.map((value, i) => {
                        const parsed = JSON.parse(value)
                        parsed.order = i
                        return [parsed.id, parsed]
                    })
                ),
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

            const includedIds = new Set(
                Object.keys(fields)
                    .map(key => key.match(/(?<=content\.team\.)\w+/)?.[0])
                    .filter(Boolean)
            )

            const orderUpdates = Object.fromEntries(
                [...includedIds].map((id, i) => [`content.team.${id}.order`, i])
            )

            const avatarUpdates = Object.fromEntries(
                await Promise.all(
                    [...includedIds]
                        .map(id => `content.team.${id}.avatar`)
                        .filter(avatarKey => avatarKey in files)
                        .map(avatarKey => encodeImage(files[avatarKey]![0]).then(avatar => [avatarKey, avatar]))
                )
            )

            const currentProject = await fetchProject(req.params.projectId, ["content.team"])
            const currentIds = new Set(Object.keys(currentProject.content?.team || {}))
            const deletions = Object.fromEntries(
                [...currentIds].filter(id => !includedIds.has(id))
                    .map(id => [`content.team.${id}`, undefined])
            )

            await updateProject(req.params.projectId, {
                ...selectFirstInFields(
                    ...Object.keys(fields)
                        .filter(key => /\.(?:name|title|twitter|linkedin)$/.test(key))
                ),
                ..._.mapValues(
                    selectFirstInFields(
                        ...Object.keys(fields)
                            .filter(key => key.endsWith(".badges"))
                    ),
                    (value: string) => value.split("\n").map(line => line.trim()).filter(Boolean)
                ),
                ...orderUpdates,
                ...avatarUpdates,
                ...deletions,
            })
            break
        default:
            return res.sendStatus(404)
    }

    res.sendStatus(204)
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