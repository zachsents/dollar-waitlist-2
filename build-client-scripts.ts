import { Glob } from "bun"


const entrypoints = await Array.fromAsync(new Glob("./client-scripts/**/*.ts").scan("."))

const environmentVariables = await Bun.file("./.env")
    .text()
    .then(text => Object.fromEntries(
        text.match(/^\w+(?=\=)/gm)?.map(key => [
            `process.env.${key}`,
            JSON.stringify(process.env[key])
        ]) ?? []
    ))

await Bun.build({
    entrypoints,
    outdir: "./public/scripts",
    target: "browser",
    define: environmentVariables,
})