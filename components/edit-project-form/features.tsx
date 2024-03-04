import type { SettingsProps } from "../../server-modules/util"
import Button from "../button"
import FeatureInput from "../feature-input"
import Input from "../input"
import SettingsContainer from "../settings-container"


export default function FeaturesSettings({ project, req }: SettingsProps) {

    const addNewInput = `
        const newInput = $('#feature-input-template > *').cloneNode(true);
        this.previousElementSibling.appendChild(newInput);
        newInput.scrollIntoView({ behavior: "smooth" });
    `

    return (
        <SettingsContainer title="Features" req={req}>
            <div class="flex flex-col gap-8">
                {project.content?.features?.map(feature =>
                    <FeatureInput {...feature} />
                )}
            </div>

            <Button
                color="green"
                leftIcon="plus"
                type="button"
                onclick={addNewInput.trim()}
            >
                Add Feature
            </Button>

            <Input
                label="Other Features"
                description="These will be displayed as bullet points under the main features. Each line will be a new bullet point."
                name="content.otherFeatures"
                textarea rows="5"
                placeholder="This is a feature.&#10;This is another feature."
                value={project.content?.otherFeatures?.join("\n") || ""}
            />

            <div id="feature-input-template" class="hidden">
                <FeatureInput />
            </div>
        </SettingsContainer>
    )
}