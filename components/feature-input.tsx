import { alpineJsonStringify, cc, cgen, type ProjectFeature } from "../server-modules/util"
import Anchor from "./anchor"
import Button from "./button"
import ImageInput from "./image-input"
import Input from "./input"
import TablerIcon from "./tabler-icon"

export default function FeatureInput({ id, title, description, icon, addGradient, gradientColor, image }: ProjectFeature & { id: string }) {

    const remove = `
        const form = this.closest('form');
        this.closest('.${cc(FeatureInput)}').remove();
        htmx.trigger(form, 'change');
    `

    const moveUp = `
        const self = this.closest('.${cc(FeatureInput)}');
        if(!self.previousElementSibling) return;
        self.parentNode.insertBefore(self, self.previousElementSibling);
        htmx.trigger(this.closest('form'), 'change');
    `

    const moveDown = `
        const self = this.closest('.${cc(FeatureInput)}');
        if(!self.nextElementSibling) return;
        self.parentNode.insertBefore(self.nextElementSibling, self);
        htmx.trigger(this.closest('form'), 'change');
    `

    return (
        <div
            class={cgen(FeatureInput, "grid grid-cols-[10rem_auto] gap-2 items-center")}
            x-data={alpineJsonStringify({ 
                id: id || "js:randomId('feature', false)", 
                gradientColor: gradientColor || "#000000",
                addGradient: addGradient || false,
            })}
        >
            <div class="flex justify-between items-center gap-4 col-span-full">
                <p class="font-bold">Feature</p>

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
                placeholder="Feature Title"
                x-bind:name="`content.features.${id}.title`"
                value={title}
                nestInLabel={false}
            />
            <Input
                label="Description"
                textarea
                placeholder="Feature Description"
                x-bind:name="`content.features.${id}.description`"
                value={description} 
                nestInLabel={false}
            />
            <Input
                label="Icon"
                description={<>
                    Uses Tabler Icons. <Anchor href="https://tabler.io/icons" targetBlank underline>Search them here.</Anchor> Enter the lowercase name of the icon.
                </>}
                type="text"
                placeholder="robot"
                x-bind:name="`content.features.${id}.icon`" 
                value={icon}
                nestInLabel={false}
            />

            <ImageInput
                label="Image"
                x-bind:name="`content.features.${id}.image`" 
                value={image}
                nestInLabel={false}
                class="justify-self-start"
            />

            <Input
                label="Add gradient behind image"
                description="If you want to add a gradient behind the image to make it stand out more."
                type="checkbox"
                x-model="addGradient"
                class="justify-self-start h-6 aspect-square"
            />
            <input 
                hidden
                x-bind:name="`content.features.${id}.addGradient`" 
                x-bind:value="addGradient || ''"
            />

            <template x-if="addGradient">
                <Input
                    label="Gradient Color"
                    x-bind:name="`content.features.${id}.gradientColor`"
                    type="text"
                    placeholder="#000000"
                    // nestInLabel={false}
                    x-bind:id="`${id}-gradientColor`"
                    x-model="gradientColor"
                    labelProps={{ class: "col-span-full" }}
                    afterInput={<label
                        x-bind:for="`${id}-gradientColor`"
                        class="w-8 aspect-square rounded-md"
                        x-bind:style="{ backgroundColor: gradientColor }"
                    />}
                />
            </template>
        </div>
    )
}
