import { alpineJsonStringify } from "../server-modules/util"
import Input from "./input"
import TablerIcon from "./tabler-icon"

export default function BenefitInput({ title, description, icon }: BenefitInputProps) {

    return (
        <div
            class="component-benefit-input flex flex-col gap-1 items-stretch"
            x-data={alpineJsonStringify({ title, description, icon })}
        >
            <div class="flex items-center gap-4">
                <button
                    class="opacity-50 hover:opacity-100 hover:text-red-500"
                    onclick="this.closest('.component-benefit-input').remove()"
                >
                    <TablerIcon name="x" />
                </button>
                <p class="font-bold">Benefit</p>
            </div>

            <Input
                label="Title"
                type="text"
                placeholder="Benefit Title"
                x-model="title"
            />
            <Input
                label="Description"
                textarea
                placeholder="Benefit Description"
                x-model="description"
            />
            <Input
                label="Icon"
                type="text"
                placeholder="robot"
                x-model="icon"
            />

            <input 
                hidden 
                x-bind:name="Boolean(title || description || icon) && 'content.benefits'"
                x-bind:value="JSON.stringify({ title, description, icon })"
            />
        </div>
    )
}

type BenefitInputProps = {
    title?: string
    description?: string
    icon?: string
}