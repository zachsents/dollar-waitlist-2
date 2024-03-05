import { cgen, htmxClasses, type HTMXMode } from "../server-modules/util"
import TablerIcon from "./tabler-icon"

export default function LoadingSpinner({ iconName = "fidget-spinner", htmx, includeWrapper, size = 24, ...props }: LoadingSpinnerProps) {
    return (
        <div
            {...props}
            class={cgen(
                "items-center justify-center",
                htmx ? ["hidden", htmxClasses[htmx].flex] : "flex",
                includeWrapper && "py-8",
                props
            )}
        >
            <TablerIcon
                name={iconName}
                class="animate-spin"
                style={{ fontSize: typeof size === "number" ? `${size}px` : size }}
            />
        </div>
    )
}

type LoadingSpinnerProps = {
    iconName?: string
    includeWrapper?: boolean
    size?: string | number
    htmx?: HTMXMode
} & JSX.IntrinsicElements["div"]
