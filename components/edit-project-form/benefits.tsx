import type { SettingsProps } from "../../server-modules/util"
import BenefitInput from "../benefit-input"
import Button from "../button"
import SettingsContainer from "../settings-container"


export default function BenefitsSettings({ project, req }: SettingsProps) {

    const addNewInput = `
        const newInput = $('#benefit-input-template > *').cloneNode(true);
        this.previousElementSibling.appendChild(newInput);
        newInput.scrollIntoView({ behavior: "smooth" });
    `

    return (
        <SettingsContainer title="Benefits" req={req}>
            <div class="flex flex-col gap-8">
                {project.content?.benefits?.map(benefit =>
                    <BenefitInput {...benefit} />
                )}
            </div>

            <Button
                color="green"
                leftIcon="plus"
                type="button"
                onclick={addNewInput.trim()}
            >
                Add Benefit
            </Button>

            <div id="benefit-input-template" class="hidden">
                <BenefitInput />
            </div>
        </SettingsContainer>
    )
}