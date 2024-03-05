

export default function SettingsContainer({ title, children }: SettingsContainerProps) {
    return (
        <form 
            x-data="{ touched: false, dirty: false, error: false }"
            x-on:change="touched = true; dirty = true"
            {...{ "x-on:htmx:after-request.camel": "dirty = false; error = $event.detail.failed" }}

            hx-post="#"
            hx-trigger="change delay:500ms"
            hx-encoding="multipart/form-data"
            hx-sync="this:replace"
            hx-on--after-request="if('name' in event.detail.requestConfig.parameters) htmx.trigger('#project-title', 'change')"

            class="flex flex-col gap-4 items-stretch"
            onsubmit="event.preventDefault()"
        >
            <div class="flex items-center justify-between gap-8">
                <h3 class="text-xl font-bold">
                    {title}
                </h3>

                <p 
                    x-show="touched && !error" 
                    x-text="dirty ? 'Saving...' : 'Saved'" 
                    class="text-sm text-light"
                    style={{ display: "none" }}
                />
                <p 
                    x-show="error" 
                    class="text-sm text-red-600"
                    style={{ display: "none" }}
                >
                    Error. Try refreshing the page.
                </p>
            </div>

            <hr />

            <div class="flex flex-col items-stretch gap-8">
                {children}
            </div>
        </form>
    )
}

type SettingsContainerProps = {
    title: string
    children: JSX.Element | JSX.Element[]
}