import { fetchProject } from "../../server-modules/firebase"
import type { SettingsProps } from "../../server-modules/util"
import Input from "../input"


export default async function SignupsSettings({ projectId }: SettingsProps) {

    const project = await fetchProject(projectId, ["signupGoal", "allowOverflowSignups"])

    return (
        <div class="grid grid-cols-[12rem_auto] gap-6 items-center">
            <Input
                label="Signup Goal"
                description="The number of signups you want to reach."
                name="signupGoal"
                type="number"
                placeholder="0"
                value={project.signupGoal?.toString() || "0"}
                nestInLabel={false}
                class="justify-self-start"
            />

            <Input
                label="Allow overflow signups"
                description="If you want to allow more signups than the goal."
                name="allowOverflowSignups"
                type="checkbox"
                checked={project.allowOverflowSignups}
                nestInLabel={false}
                class="justify-self-start h-6 aspect-square"
            />
        </div>)
}