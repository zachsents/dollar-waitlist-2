import { htmxClasses, type HTMXMode } from "../server-modules/util"
import TablerIcon from "./tabler-icon"

export default function LoadingSpinner({ iconName = "fidget-spinner", htmx, includeWrapper, size = "24px", ...props }: LoadingSpinnerProps) {

    const htmxClass = htmx ?
        `htmx-indicator hidden ${htmxClasses[htmx].flex}` :
        "flex"

    const wrapperClass = includeWrapper ?
        "py-8" :
        ""

    return (
        <div
            {...props}
            class={`items-center justify-center ${wrapperClass} ${htmxClass} ${props.class || ""}`}
        >
            <TablerIcon
                name={iconName}
                class="animate-spin"
                style={{ fontSize: size }}
            />
        </div>
    )
}

type LoadingSpinnerProps = {
    iconName?: string
    includeWrapper?: boolean
    size?: string
    htmx?: HTMXMode
} & JSX.IntrinsicElements["div"]
