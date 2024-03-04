import type { Request } from "express"
import Button from "./button"


export default function SettingsContainer({ title, children, req }: SettingsContainerProps) {

    const reset = `
        $('.component-tabs--tab[data-active]', this.closest('.component-tabs')).click()
    `
    
    return (
        <form 
            x-data="{ touched: false }"
            x-on:change="touched = true"

            hx-post={`/api/projects/${req.params.projectId}/settings`}
            hx-encoding="multipart/form-data"
            hx-trigger="submit"
            hx-target="this"
            hx-vals="js:{ avatarMap: $$('.team-input-avatar', event.target).slice(0, -1).map(el => !!el.value) }"
            hx-on-htmx-after-request={reset.trim()}
            hx-swap="outerHTML"

            class="flex flex-col gap-4 items-stretch"
        >
            <div class="flex items-center justify-between gap-8">
                <h3 class="text-xl font-bold">
                    {title}
                </h3>

                <div class="flex items-center gap-2">
                    <Button
                        color="red" leftIcon="reload" class="text-xs"
                        type="button"
                        x-show="touched"
                        onclick={reset.trim()}
                    >
                        Reset
                    </Button>
                    <Button
                        color="green" leftIcon="check" class="text-xs"
                        type="submit"
                        x-show="touched"
                        htmx="ancestor"
                    >
                        Save Changes
                    </Button>
                </div>
            </div>

            <hr />

            <div class="flex flex-col items-start gap-8">
                {children}
            </div>
        </form>
    )
}

type SettingsContainerProps = {
    title: string
    req: Request
    children: JSX.Element | JSX.Element[]
}