import { fetchProject } from "../../server-modules/firebase"
import type { SettingsProps } from "../../server-modules/util"
import Input from "../input"

export default async function TweetsSettings({ projectId }: SettingsProps) {
    const project = await fetchProject(projectId, ["content.tweets"])

    return (
        <div class="grid grid-cols-[12rem_auto] gap-6 items-center">
            <Input
                label="Tweet URLs"
                description="These will be displayed as cards on the project page. Each line will be a new tweet. Either domain (twitter.com or x.com) is accepted."
                name="content.tweets"
                textarea rows="8"
                placeholder="https://twitter.com/ZachSents/status/1758626435839799480&#10;..."
                value={project.content?.tweets?.join("\n") || ""}
                nestInLabel={false}
            />
        </div>
    )
}