import { cgen } from "../server-modules/util"

export default function PageShell({ children, title, afterBody, scriptName, ...props }: PageShellProps) {
    return (<>
        {"<!DOCTYPE html>"}
        <html>
            <head>
                <link rel="stylesheet" href="/styles.css" />
                <title>{title || "Dollar Waitlist"}</title>

                <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />

                <meta name="htmx-config" content='{"includeIndicatorStyles": false}' />
            </head>

            <body
                {...props}
                class={cgen("dark:bg-neutral-900 min-h-screen relative text-regular", props)}
            >
                {children}
            </body>

            {afterBody}
            {scriptName &&
                <script defer type="module" src={`/scripts/${scriptName}.js`} />}
            <script defer type="module" src="/scripts/global.js" />

            <script src="https://unpkg.com/htmx.org@1.9.10" />
            <script src="https://unpkg.com/htmx.org/dist/ext/json-enc.js" />
        </html>
    </>)
}


type PageShellProps = {
    title?: string,
    afterBody?: JSX.Element | JSX.Element[],
    scriptName?: string,
    children?: JSX.Element | JSX.Element[]
} & JSX.IntrinsicElements["body"]