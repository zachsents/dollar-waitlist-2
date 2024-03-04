import type { SettingsProps } from "../../server-modules/util"
import Input from "../input"
import SettingsContainer from "../settings-container"


export default function SignupsSettings({ project, req }: SettingsProps) {
    return (
        <SettingsContainer title="Signups" req={req}>
            <Input
                label="Signup Goal"
                description="The number of signups you want to reach."
                name="signupGoal"
                type="number"
                placeholder="0"
                value={project.signupGoal?.toString() || "0"}
            />

            <Input
                label="Allow overflow signups"
                description="If you want to allow more signups than the goal."
                name="allowOverflowSignups"
                type="checkbox"
                checked={project.allowOverflowSignups}
            />
        </SettingsContainer>
    )
}