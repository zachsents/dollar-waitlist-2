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
import { admin, fetchProject, fetchProjectsForUser, updateProject } from "./server-modules/firebase"


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

// app.get("/api/projects/:projectId/settings", authenticate(), async (req: Request, res: Response) => {
//     const project = await fetchProject(req.params.projectId)

//     res.format({
//         html: renderSnippet(`edit-project-form/${req.query.tab}`, { project, req }, res),
//     })
// })

app.post("/api/projects/:projectId/settings", authenticate(), async (req: Request, res: Response) => {

    const formParser = formidable({
        multiples: true,
    })

    const [fields, files] = await formParser.parse(req)

    const tab = fields.tab![0]
    const avatarMap = fields.avatarMap?.map((value: string) => value === "true")
    const updates: any = _.mapValues(_.omit(fields, "tab", "avatarMap"), value => {
        return Array.isArray(value) && value.length === 1 ? value[0] : value
    })

    const encodeImage = async (file: File) => {
        const fileBuffer = await Bun.file(file.filepath).arrayBuffer()

        if (file.mimetype === "text/svg+xml") {
            return await sharp(fileBuffer)
                .resize({ height: 200, withoutEnlargement: true })
                .toBuffer()
                .then(buf => `data:text/svg+xml;base64, ${buf.toString("base64")}`)
        }

        return await sharp(fileBuffer)
            .resize({ height: 200, withoutEnlargement: true })
            .webp()
            .toBuffer()
            .then(buf => `data:image/webp;base64, ${buf.toString("base64")}`)
    }

    if (files.logo) {
        updates.logo = await encodeImage(files.logo[0])
    }

    const cleanJsonList = (key: string) => {
        if (!updates[key])
            return

        const clean = (item: string) => JSON.parse(item)

        if (Array.isArray(updates[key]))
            updates[key] = updates[key].map(clean)

        else if (typeof updates[key] === "string")
            updates[key] = [clean(updates[key])]
    }

    ["content.features", "content.team", "content.benefits"].forEach(cleanJsonList)

    const splitMultiline = (value: any) => {
        if (!value || typeof value !== "string")
            return value

        return (value as string).split("\n")
            .map(line => line.trim())
            .filter(Boolean)
    }

    ["content.otherFeatures", "content.tweets"].forEach(key => {
        if (updates[key])
            updates[key] = splitMultiline(updates[key])
    })

    if (updates["content.team"]) {
        (updates["content.team"] as any[]).forEach((teamMember: any) => {
            teamMember.badges = splitMultiline(teamMember.badges)
        })
    }

    if (files.avatar && tab === "team") {
        const encodedAvatars = await Promise.all(files.avatar.map(encodeImage))

        avatarMap!.forEach((isAvatarIncluded, i) => {
            if (isAvatarIncluded)
                updates["content.team"][i].avatar = encodedAvatars.shift()
        })
    }

    ["onlyShowLogo", "allowOverflowSignups"].forEach(key => {
        updates[key] = Boolean(updates[key])
    })

    await updateProject(req.params.projectId, updates)

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
app.get("/projects/:projectId/settings/:tab", authenticate(), renderPage("edit-project"))

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