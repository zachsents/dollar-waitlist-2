import { cgen } from "../server-modules/util"

export default async function TablerIcon({ name, filled = false, ...props }: TablerIconProps) {

    let svgContent = await fetch(`https://unpkg.com/@tabler/icons@2.47.0/icons/${name}.svg`).then(res => res.text())

    return (
        <div {...props} class={cgen("[&>svg]:w-[1em] [&>svg]:h-auto [&>svg]:aspect-square", props)}>
            {svgContent}
        </div>
    )
}

type TablerIconProps = {
    name: string
    filled?: boolean
} & JSX.IntrinsicElements["div"]