import { fetchProject, fetchSignupCount } from "../../server-modules/firebase"
import { alpineJsonStringify, type SettingsProps } from "../../server-modules/util"
import Button from "../button"
import Input from "../input"


export default async function SignupsSettings({ projectId }: SettingsProps) {

    const project = await fetchProject(projectId, ["signupGoal", "allowOverflowSignups", "webhookUrl"])

    const signupCount = await fetchSignupCount(projectId)

    return (
        <div
            class="grid grid-cols-[12rem_auto] gap-6 items-center"
            x-data={alpineJsonStringify({
                allowOverflowSignups: project.allowOverflowSignups || false,
            })}
        >
            <Input
                label="Signup Goal"
                description="The number of signups you want to reach. Leave blank to remove the goal."
                name="signupGoal"
                type="number"
                placeholder="0"
                value={project.signupGoal?.toString() || ""}
                nestInLabel={false}
                class="justify-self-start"
            />

            <Input
                label="Allow overflow signups"
                description="If you want to allow more signups than the goal."
                type="checkbox"
                x-model="allowOverflowSignups"
                nestInLabel={false}
                class="justify-self-start h-6 aspect-square"
            />
            <input
                hidden
                name="allowOverflowSignups"
                {...{
                    ":value": "allowOverflowSignups || ''"
                }}
            />

            <hr class="col-span-full" />

            <Input
                label="Webhook URL"
                description="A URL to send a POST request to when a new signup is created. Leave blank to disable."
                name="webhookUrl"
                type="text"
                placeholder="https://example.com/webhook"
                value={project.webhookUrl || ""}
                nestInLabel={false}
            />

            <hr class="col-span-full" />

            <p class="col-span-full">
                There are currently <strong class="text-green-600">{signupCount}</strong> signups.
            </p>

            <div class="col-span-full flex items-center gap-2">
                <Button
                    color="green" leftIcon="download" rightIcon="file-spreadsheet" class="text-sm"
                    href={`/projects/${projectId}/signups?format=csv&download`}
                >
                    Export Signups as CSV
                </Button>
                <Button
                    color="blue" leftIcon="download" rightIcon="braces" class="text-sm"
                    href={`/projects/${projectId}/signups?format=json&download`}
                >
                    Export Signups as JSON
                </Button>
            </div>
        </div>)
}