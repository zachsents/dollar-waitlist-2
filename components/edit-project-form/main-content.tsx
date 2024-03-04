import type { SettingsProps } from "../../server-modules/util"
import Input from "../input"
import SettingsContainer from "../settings-container"


export default function MainContentSettings({ project, req }: SettingsProps) {
    return (
        <SettingsContainer title="Hero" req={req}>
            <Input
                label="Headline"
                description="A short, catchy headline for your project. This will be the h1 tag on your landing page."
                name="content.headline"
                textarea
                placeholder="Something short and catchy!"
                value={project.content?.headline || ""}
            />

            <Input
                label="Description"
                description="The text underneath the headline. This is where you can describe your project in more detail."
                name="content.description"
                textarea rows="4"
                placeholder="Describe what your project is about."
                value={project.content?.description || ""}
            />

            <Input
                label="Eyebrow"
                description="A very short line above the headline in small text. Leave blank to not show."
                name="content.eyebrow"
                textarea
                placeholder="Hey indie hackers!"
                value={project.content?.eyebrow || ""}
            />
        </SettingsContainer>
    )
}