import { fetchProject } from "../../server-modules/firebase"
import type { SettingsProps } from "../../server-modules/util"
import BenefitInput from "../benefit-input"
import Button from "../button"


export default async function BenefitsSettings({ projectId }: SettingsProps) {
    const project = await fetchProject(projectId, ["content.benefits"])

    const sortedBenefits = Object.entries(project.content?.benefits || {})
        .map(([key, value]) => ({
            ...value,
            id: key,
        }))
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    const addNewInput = `
        const fragClone = $('#benefit-input-template').content.cloneNode(true);
        const newInput = fragClone.childNodes[0];
        this.previousElementSibling.appendChild(fragClone);
        newInput.scrollIntoView({ behavior: "smooth" });
    `

    return (
        <>
            <div class="flex flex-col gap-8">
                {sortedBenefits.map(benefit =>
                    <BenefitInput {...benefit} />
                )}
            </div>

            <Button
                color="green" leftIcon="plus" type="button"
                class="text-sm"
                onclick={addNewInput.trim()}
            >
                Add Benefit
            </Button>

            <template id="benefit-input-template">
                <BenefitInput />
            </template>
        </>
    )
}