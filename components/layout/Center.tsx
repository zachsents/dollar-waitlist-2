import { cgen } from "../../server-modules/util"

export default function Center({ children, ...props }: CenterProps) {

    return (
        <div {...props} class={cgen(
            "flex flex-col items-center justify-center",
            props
        )}>
            {children}
        </div>
    )
}

export type CenterProps = {
    children?: any
} & JSX.IntrinsicElements["div"]