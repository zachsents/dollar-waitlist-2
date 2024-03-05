import { cgen } from "../../server-modules/util"

export default function Stack({ children, ...props }: StackProps) {

    return (
        <div {...props} class={cgen(
            "flex flex-col items-stretch",
            props
        )}>
            {children}
        </div>
    )
}

export type StackProps = {
    children?: any
} & JSX.IntrinsicElements["div"]