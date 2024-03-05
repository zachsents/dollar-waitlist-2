import { fetchProject } from "../../server-modules/firebase"
import { alpineJsonStringify, type SettingsProps } from "../../server-modules/util"
import ImageInput from "../image-input"
import Input from "../input"


export default async function GeneralSettings({ projectId }: SettingsProps) {

    const project = await fetchProject(projectId, ["name", "logo", "onlyShowLogo", "colors.primary"])

    return (
        <div 
            class="grid grid-cols-[12rem_auto] gap-6 items-center"
            x-data={alpineJsonStringify({ primaryColor: project.colors?.primary || "#000000" })}
        >
            <Input
                label="Project Name"
                name="name"
                type="text"
                placeholder="Project Name"
                value={project.name}
                nestInLabel={false}
            />

            <hr class="col-span-2" />

            <ImageInput
                label="Logo"
                name="logo"
                value={project.logo}
                nestInLabel={false}
                class="justify-self-start"
            />

            <hr class="col-span-2" />

            <Input
                label="Only show logo"
                description="If you want to only show the logo and not the project name. This is useful if your logo already contains the project name."
                name="onlyShowLogo"
                type="checkbox"
                checked={project.onlyShowLogo}
                class="justify-self-start h-6 aspect-square"
                nestInLabel={false}
            />

            <hr class="col-span-2" />

            <Input
                label="Primary Color"
                name="colors.primary"
                type="text"
                placeholder="#000000"
                nestInLabel={false}
                id="primaryColorInput"
                
                x-model="primaryColor"
                afterInput={<label
                    for="primaryColorInput" 
                    class="w-8 aspect-square rounded-md" 
                    x-bind:style="{ backgroundColor: primaryColor }"
                />}
            />
        </div>
    )
}