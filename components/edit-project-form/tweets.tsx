import type { SettingsProps } from "../../server-modules/util"
import Input from "../input"
import SettingsContainer from "../settings-container"


export default function TweetsSettings({ project, req }: SettingsProps) {
    return (
        <SettingsContainer title="Tweets" req={req}>
            <Input
                label="Tweet URLs"
                description="These will be displayed as cards on the project page. Each line will be a new tweet. Either domain (twitter.com or x.com) is accepted."
                name="content.tweets"
                textarea rows="8"
                placeholder="https://twitter.com/ZachSents/status/1758626435839799480&#10;..."
                value={project.content?.tweets?.join("\n") || ""}
            />
        </SettingsContainer>
    )
}