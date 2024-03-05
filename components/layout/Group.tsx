import { cgen } from "../../server-modules/util"

export default function Group({ children, noWrap, ...props }: GroupProps) {

    return (
        <div {...props} class={cgen(
            "flex items-center gap-4",
            noWrap && "flex-nowrap",
            props
        )}>
            {children}
        </div>
    )
}

type GroupProps = {
    noWrap?: boolean
    children?: any
} & JSX.IntrinsicElements["div"]