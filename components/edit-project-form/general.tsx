import type { SettingsProps } from "../../server-modules/util"
import ImageInput from "../image-input"
import Input from "../input"
import SettingsContainer from "../settings-container"


export default function GeneralSettings({ project, req }: SettingsProps) {
    return (
        <SettingsContainer title="General" req={req}>
            <Input
                label="Project Name"
                description="This will be displayed to your users."
                name="name"
                type="text"
                placeholder="Project Name"
                value={project.name}

                x-data
                x-init="document.getElementById('project-title').textContent = $el.value"
            />

            <ImageInput label="Logo" name="logo" value={project.logo} />

            <Input
                label="Only show logo"
                description="If you want to only show the logo and not the project name. This is useful if your logo already contains the project name."
                name="onlyShowLogo"
                type="checkbox"
                checked={project.onlyShowLogo}
            />

            <div 
                class="flex items-center gap-4" 
                x-data={JSON.stringify({ 
                    color: project.colors?.primary || "#000000" 
                })}
            >
                <Input
                    label="Primary Color"
                    name="colors.primary"
                    type="text"
                    x-model="color"
                />

                <div class="w-8 aspect-square rounded-md" x-bind:style="{ backgroundColor: color }" />
            </div>
        </SettingsContainer>
    )
}