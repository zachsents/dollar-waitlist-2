import { alpineJsonStringify, cc, cgen } from "../server-modules/util"
import Button from "./button"
import Input from "./input"
import TablerIcon from "./tabler-icon"


function BenefitInput({ id, title, description, icon }: BenefitInputProps) {
    const remove = `
        const form = this.closest('form');
        this.closest('.${cc(BenefitInput)}').remove();
        htmx.trigger(form, 'change');
    `

    const moveUp = `
        const self = this.closest('.${cc(BenefitInput)}');
        if(!self.previousElementSibling) return;
        self.parentNode.insertBefore(self, self.previousElementSibling);
        htmx.trigger(this.closest('form'), 'change');
    `

    const moveDown = `
        const self = this.closest('.${cc(BenefitInput)}');
        if(!self.nextElementSibling) return;
        self.parentNode.insertBefore(self.nextElementSibling, self);
        htmx.trigger(this.closest('form'), 'change');
    `
    
    return (
        <div
            class={cgen(BenefitInput, "grid grid-cols-[10rem_auto] gap-2 items-center")}
            x-data={alpineJsonStringify({ 
                id: id || "js:randomId('benefit', false)", 
                title, description, icon 
            })}
        >
            <div class="flex justify-between items-center gap-4 col-span-full">
                <p class="font-bold">Benefit</p>

                <div class="flex items-center gap-1 text-xs opacity-50 hover:opacity-100 transition-opacity">
                    <Button
                        color="gray"
                        onclick={moveDown.trim()}
                    >
                        <TablerIcon name="arrow-down" />
                    </Button>
                    <Button
                        color="gray"
                        onclick={moveUp.trim()}
                    >
                        <TablerIcon name="arrow-up" />
                    </Button>
                    <Button
                        color="red"
                        onclick={remove.trim()}
                    >
                        <TablerIcon name="x" />
                    </Button>
                </div>
            </div>

            <Input
                label="Title"
                type="text"
                placeholder="Benefit Title"
                x-model="title"
                nestInLabel={false}
            />
            <Input
                label="Description"
                textarea
                placeholder="Benefit Description"
                x-model="description"
                nestInLabel={false}
            />
            <Input
                label="Icon"
                type="text"
                placeholder="robot"
                x-model="icon"
                nestInLabel={false}
            />

            <input 
                hidden 
                x-bind:name="Boolean(title || description || icon) && 'content.benefits'"
                x-bind:value={`JSON.stringify({ id, title, description, icon })`}
            />
        </div>
    )
}

export default BenefitInput

type BenefitInputProps = {
    id?: string
    title?: string
    description?: string
    icon?: string
}