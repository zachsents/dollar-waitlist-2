import { cgen } from "../server-modules/util"

export default function Anchor({ children, underline = false, targetBlank = false, ...props }: AnchorProps) {
    return (
        <a
            {...targetBlank && { target: "_blank" }}
            {...props}
            class={cgen("component-anchor hover:text-green-600 data-[active]:text-green-600", underline && "underline", props)}
        >
            {children}
        </a>
    )
}

export type AnchorProps = {
    children: JSX.Element | JSX.Element[],
    underline?: boolean
    targetBlank?: boolean
} & JSX.IntrinsicElements["a"]