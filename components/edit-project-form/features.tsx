import { fetchProject } from "../../server-modules/firebase"
import type { SettingsProps } from "../../server-modules/util"
import Button from "../button"
import FeatureInput from "../feature-input"
import Input from "../input"


export default async function FeaturesSettings({ projectId }: SettingsProps) {

    const project = await fetchProject(projectId, ["content.features", "content.otherFeatures"])

    const sortedFeatues = Object.entries(project.content?.features || {})
        .map(([key, value]) => ({
            ...value,
            id: key,
        }))
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    const addNewInput = `
        const fragClone = $('#feature-input-template').content.cloneNode(true);
        const newInput = fragClone.childNodes[0];
        this.previousElementSibling.appendChild(fragClone);
        newInput.scrollIntoView({ behavior: "smooth" });
    `

    return (
        <>
            <div class="flex flex-col gap-8">
                {sortedFeatues.map(feature =>
                    <FeatureInput {...feature} />
                )}
            </div>

            <Button
                color="green" leftIcon="plus" type="button"
                class="text-sm"
                onclick={addNewInput.trim()}
            >
                Add Feature
            </Button>

            <div class="grid grid-cols-[12rem_auto] gap-6 items-center">
                <Input
                    label="Other Features"
                    description="These will be displayed as bullet points under the main features. Each line will be a new bullet point."
                    name="content.otherFeatures"
                    textarea rows="5"
                    placeholder="This is a feature.&#10;This is another feature."
                    value={project.content?.otherFeatures?.join("\n") || ""}
                    nestInLabel={false}
                />
            </div>

            <template id="feature-input-template">
                <FeatureInput />
            </template>
        </>
    )
}