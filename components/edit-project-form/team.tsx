import { fetchProject } from "../../server-modules/firebase"
import type { SettingsProps } from "../../server-modules/util"
import Button from "../button"
import TeamInput from "../team-input"


async function TeamSettings({ projectId }: SettingsProps) {
    const project = await fetchProject(projectId, ["content.team"])

    const sortedTeam = Object.entries(project.content?.team || {})
        .map(([key, value]) => ({
            ...value,
            id: key,
        }))
        .sort((a, b) => (a.order || 0) - (b.order || 0))

    const addNewInput = `
        const fragClone = $('#team-input-template').content.cloneNode(true);
        const newInput = fragClone.childNodes[0];
        this.previousElementSibling.appendChild(fragClone);
        newInput.scrollIntoView({ behavior: "smooth" });
    `

    return (
        <>
            <div class="flex flex-col gap-8">
                {sortedTeam.map(team =>
                    <TeamInput {...team} />
                )}
            </div>

            <Button
                color="green"
                leftIcon="plus"
                type="button"
                class="text-sm"
                onclick={addNewInput.trim()}
            >
                Add Team Member
            </Button>

            <template id="team-input-template">
                <TeamInput />
            </template>
        </>
    )
}

export default TeamSettings