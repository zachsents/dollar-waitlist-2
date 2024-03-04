import type { SettingsProps } from "../../server-modules/util"
import Button from "../button"
import SettingsContainer from "../settings-container"
import TeamInput from "../team-input"


export default function TeamSettings({ project, req }: SettingsProps) {

    const addNewInput = `
        const newInput = $('#team-input-template > *').cloneNode(true);
        this.previousElementSibling.appendChild(newInput);
        newInput.scrollIntoView({ behavior: "smooth" });
    `

    return (
        <SettingsContainer title="Team" req={req}>
            <div class="flex flex-col gap-8">
                {project.content?.team?.map(team =>
                    <TeamInput {...team} />
                )}
            </div>

            <Button
                color="green"
                leftIcon="plus"
                type="button"
                onclick={addNewInput.trim()}
            >
                Add Team Member
            </Button>

            <div id="team-input-template" class="hidden">
                <TeamInput />
            </div>
        </SettingsContainer>
    )
}