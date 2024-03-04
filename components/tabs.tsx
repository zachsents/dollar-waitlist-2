import { cgen, htmxClasses } from "../server-modules/util"
import LoadingSpinner from "./loading-spinner"


export default function Tabs({ tabs, defaultValue: _defaultValue, ...props }: TabsProps) {

    const defaultValue = _defaultValue || tabs[0]?.value

    const htmxTabValue = `
        event?.target.closest?.('.component-tabs')?.dataset.tab || "${defaultValue}"
    `

    return (
        <div
            class="component-tabs flex items-start gap-8" 

            x-data={JSON.stringify({ tab: defaultValue })}
            x-bind:data-tab="tab"
            
            hx-target="find .component-tabs--content"
            hx-trigger="load,click target:.component-tabs--tab"
            hx-vals={`js:{ tab: ${htmxTabValue.trim()} }`}

            {...props}
        >
            <div class="component-tabs--list flex flex-col items-stretch min-w-32 max-w-56 shrink-0">
                {tabs.map(tab =>
                    <button
                        class="component-tabs--tab px-4 py-1 text-left data-[active]:bg-gray-500/20 rounded-md transition-colors hover:text-green-600"
                        data-value={tab.value}
                        x-bind:data-active={`tab === "${tab.value}"`}
                        x-on:click={`tab = "${tab.value}"`}
                    >
                        {tab.content}
                    </button>
                )}
            </div>

            <LoadingSpinner 
                class="component-tabs--spinner" 
                htmx="parent" includeWrapper
            />

            <section class={`component-tabs--content flex-1 ${htmxClasses.parent.hidden}`} />
        </div>
    )
}

type TabsProps = {
    tabs: {
        content: string | JSX.Element
        value: string
    }[]
    defaultValue?: string
} & JSX.IntrinsicElements["div"]


function Tab({ children, active = false, ...props }: TabProps) {
    return (
        <a
            {...props}
            class={cgen("px-4 py-1 text-left data-[active]:bg-gray-500/20 rounded-md transition-colors hover:text-green-600", props)}
            data-active={active}
        >
            {children}
        </a>
    )
}

type TabProps = {
    children: JSX.Element | JSX.Element[]
    active?: boolean
} & JSX.IntrinsicElements["button"]

Tabs.Tab = Tab