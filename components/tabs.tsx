import { alpineJsonStringify, cc, cgen, htmxClasses } from "../server-modules/util"
import LoadingSpinner from "./loading-spinner"


export default function Tabs({ children, tabs, currentTab, ...props }: TabsProps) {
    return (
        <div
            {...props}
            class={cgen(Tabs, "flex items-start gap-8", props)}
            x-data={alpineJsonStringify({ currentTab })}
        >
            <nav
                class="flex flex-col items-stretch min-w-32 max-w-56 shrink-0"
                hx-boost="true"
                hx-indicator={`closest .${cc(Tabs)}`}
                hx-sync="this:replace"
            >
                {tabs}
            </nav>

            <LoadingSpinner
                htmx="parent"
                includeWrapper class="flex-1"
            />

            <section class={cgen("flex-1", htmxClasses.parent.hidden)}>
                {children}
            </section>
        </div>
    )
}

type TabsProps = {
    tabs: JSX.Element | JSX.Element[]
    children: JSX.Element | JSX.Element[]
    currentTab: string
} & JSX.IntrinsicElements["div"]


function Tab({ children, value, ...props }: TabProps) {
    return (
        <a
            {...props}
            class={cgen(cc(Tabs, "tab"), "px-4 py-1 text-left data-[active]:bg-gray-500/20 rounded-md transition-colors hover:text-green-600", props)}
            x-bind:data-active={`currentTab === "${value}"`}
            x-on:click={`currentTab = "${value}"`}
        >
            {children}
        </a>
    )
}

type TabProps = {
    children: JSX.Element | JSX.Element[]
    value: string
} & JSX.IntrinsicElements["a"]

Tabs.Tab = Tab