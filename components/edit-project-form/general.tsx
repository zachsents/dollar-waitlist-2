import { fetchProject } from "../../server-modules/firebase"
import { alpineJsonStringify, type SettingsProps } from "../../server-modules/util"
import Button from "../button"
import ImageInput from "../image-input"
import Input from "../input"


export default async function GeneralSettings({ projectId }: SettingsProps) {

    const project = await fetchProject(projectId, ["name", "logo", "onlyShowLogo", "colors.primary"])

    return (
        <div
            class="grid grid-cols-[12rem_auto] gap-6 items-center"
            x-data={alpineJsonStringify({
                primaryColor: project.colors?.primary || "#000000",
                onlyShowLogo: project.onlyShowLogo || false,
            })}
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
                type="checkbox"
                x-model="onlyShowLogo"
                class="justify-self-start h-6 aspect-square"
                nestInLabel={false}
            />
            <input
                hidden
                name="onlyShowLogo"
                {...{
                    ":value": "onlyShowLogo || ''",
                }}
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
                    {...{
                        ":style": "{ backgroundColor: primaryColor }",
                    }}
                />}
            />

            <hr class="col-span-2" />

            <Input
                label="Live Site URL"
                description="The URL where your project is hosted. Fill this in when your waitlist period is over and your product is live. Including this will prevent further signups. Leave blank to allow signups."
                name="liveSiteUrl"
                type="text"
                placeholder="https://example.com"
                value={project.liveSiteUrl || ""}
                nestInLabel={false}
            />

            <hr class="col-span-2" />

            <details>
                <summary class="text-light cursor-pointer">
                    Dangerous Actions
                </summary>

                <div class="flex items-center gap-2 mt-8">
                    <Button
                        color="red" class="text-sm"
                        hx-delete={`/projects/${projectId}`}
                        hx-confirm="Are you sure you want to delete this project? This action cannot be undone."
                        htmx="parent"
                    >
                        Delete Project
                    </Button>
                </div>
            </details>

        </div>
    )
}