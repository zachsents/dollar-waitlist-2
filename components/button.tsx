import { htmxClasses, type HTMXMode } from "../server-modules/util"
import LoadingSpinner from "./loading-spinner"
import TablerIcon from "./tabler-icon"


export default function Button({ children, color, leftSection, leftIcon, rightSection, rightIcon, htmx, ...props }: ButtonProps) {

    const hasLeftSection = Boolean(leftSection || leftIcon)

    const Component = props.href ? "a" : "button"

    return (
        <Component
            {...props}
            class={`flex items-center gap-[1em] justify-center bg-${color}-500 text-white px-[1em] py-[0.5em] rounded-[0.5em] hover:bg-${color}-600 transition active:scale-95 ${props.class || ""}`}
        >
            {hasLeftSection &&
                <div class={htmx ? htmxClasses[htmx].hidden : ""}>
                    {leftSection || (leftIcon && <TablerIcon name={leftIcon} />)}
                </div>}

            {htmx &&
                <LoadingSpinner
                    htmx={htmx}
                    iconName="loader"
                    size="1em"
                />}

            {children}

            {rightSection || (rightIcon && <TablerIcon name={rightIcon} />)}
        </Component>
    )
}

export type ButtonProps = {
    children: JSX.Element | string
    color: string
    leftSection?: JSX.Element
    leftIcon?: string
    rightSection?: JSX.Element
    rightIcon?: string
    htmx?: HTMXMode
} & JSX.IntrinsicElements["button"] & JSX.IntrinsicElements["a"]


/*
bg-slate-500 hover:bg-slate-600
bg-gray-500 hover:bg-gray-600
bg-zinc-500 hover:bg-zinc-600
bg-neutral-500 hover:bg-neutral-600
bg-stone-500 hover:bg-stone-600
bg-red-500 hover:bg-red-600
bg-orange-500 hover:bg-orange-600
bg-amber-500 hover:bg-amber-600
bg-yellow-500 hover:bg-yellow-600
bg-lime-500 hover:bg-lime-600
bg-green-500 hover:bg-green-600
bg-emerald-500 hover:bg-emerald-600
bg-teal-500 hover:bg-teal-600
bg-cyan-500 hover:bg-cyan-600
bg-sky-500 hover:bg-sky-600
bg-blue-500 hover:bg-blue-600
bg-indigo-500 hover:bg-indigo-600
bg-violet-500 hover:bg-violet-600
bg-purple-500 hover:bg-purple-600
bg-fuchsia-500 hover:bg-fuchsia-600
bg-pink-500 hover:bg-pink-600
bg-rose-500 hover:bg-rose-600
*/