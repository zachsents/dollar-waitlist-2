import { cgen } from "../server-modules/util"


const siteName = "Dollar Waitlist"
const shortDescription = "Build premium waitlists"


export default function PageShell({ children, title, afterBody, scriptName, ...props }: PageShellProps) {
    return (<>
        {"<!DOCTYPE html>"}
        <html lang="en">
            <head>
                {/* Setup */}
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />

                {/* Meta Description */}
                <meta
                    name="description"
                    content="Validate your product idea with high-intent early adopters by building a premium waitlist in under 5 minutes for free."
                />

                {/* Favicon & other icons */}
                <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
                <link rel="icon" href="/assets/favicon.ico" type="image/x-icon" />
                <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon-16x16.png" />
                <link rel="manifest" href="/assets/site.webmanifest" />

                {/* OpenGraph */}
                <meta
                    property="og:title"
                    content={siteName}
                />
                <meta
                    property="og:description"
                    content={shortDescription}
                />
                <meta property="og:image" content="/assets/og.png" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={siteName} />
                <meta name="twitter:creator" content="@ZachSents" />
                <meta name="twitter:image" content="/assets/og.png" />
                <meta name="twitter:description" content={shortDescription} />

                {/* Google Fonts */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />

                {/* HTMX Config */}
                <meta name="htmx-config" content='{"includeIndicatorStyles": false}' />

                {/* Alpine */}
                <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" />

                {/* My Styles */}
                <link rel="stylesheet" href="/styles.css" />

                {/* Page Title */}
                <title>{title || siteName}</title>
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