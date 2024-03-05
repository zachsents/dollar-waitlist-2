
export default function Anchor({ class: classNames, children, ...props }: AnchorProps) {
    return (
        <a
            class={`component-anchor hover:text-green-600 data-[active]:text-green-600 ${classNames || ""}`}
            {...props}
        >
            {children}
        </a>
    )
}

export type AnchorProps = {
    class?: string,
    children: JSX.Element | JSX.Element[],
} & JSX.IntrinsicElements["a"]