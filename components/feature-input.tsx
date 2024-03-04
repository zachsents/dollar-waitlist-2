import { alpineJsonStringify } from "../server-modules/util"
import Input from "./input"
import TablerIcon from "./tabler-icon"

export default function FeatureInput({ title, description, icon }: FeatureInputProps) {
    return (
        <div
            class="component-feature-input flex flex-col gap-1 items-start"
            x-data={alpineJsonStringify({ title, description, icon })}
        >
            <div class="flex items-center gap-4">
                <button
                    class="opacity-50 hover:opacity-100 hover:text-red-500"
                    onclick="this.closest('.component-feature-input').remove()"
                >
                    <TablerIcon name="x" />
                </button>
                <p class="font-bold">Feature</p>
            </div>

            <Input
                label="Title"
                type="text"
                placeholder="Feature Title"
                x-model="title"
            />
            <Input
                label="Description"
                textarea
                placeholder="Feature Description"
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
                x-bind:name="Boolean(title || description || icon) && 'content.features'"
                x-bind:value="JSON.stringify({ title, description, icon })"
            />
        </div>
    )
}

type FeatureInputProps = {
    title?: string
    description?: string
    icon?: string
}