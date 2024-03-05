import { evfn } from "../server-modules/util"


export default function Menu({ label, children, ...props }: MenuProps) {
    return (
        <details {...props} class="relative group"
            onclick="event.stopPropagation()"
            ontoggle={evfn((ev, el) => {
                if (el.hasAttribute('open'))
                    window.addEventListener("click", () => {
                        el.removeAttribute("open")
                    }, { once: true })
            })}
        >
            <summary class="cursor-pointer px-2 py-1 rounded-md hover:bg-gray-500/10 transition-colors select-none marker:content-none">
                {label}
            </summary>
            <div
                class="bg-white dark:bg-neutral-800 px-4 py-2 shadow-lg rounded-md absolute right-0 w-40 flex flex-col items-stretch gap-1"
            >
                {children}
            </div>
        </details>
    )
}

type MenuProps = {
    label: string | JSX.Element,
    children: JSX.Element | JSX.Element[],
} & JSX.IntrinsicElements["details"]

