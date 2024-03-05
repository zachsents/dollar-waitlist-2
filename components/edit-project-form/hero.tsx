import { fetchProject } from "../../server-modules/firebase"
import type { SettingsProps } from "../../server-modules/util"
import Input from "../input"


export default async function HeroSettings({ projectId }: SettingsProps) {

    const project = await fetchProject(projectId, ["content.headline", "content.description", "content.eyebrow"])

    return (
        <div class="grid grid-cols-[12rem_auto] gap-6 items-center">
            <Input
                label="Eyebrow"
                description="A very short line above the headline in small text. Leave blank to not show."
                name="content.eyebrow"
                textarea
                placeholder="Hey indie hackers!"
                value={project.content?.eyebrow || ""}
                nestInLabel={false}
            />

            <Input
                label="Headline"
                description="A short, catchy headline for your project. This will be the h1 tag on your landing page."
                name="content.headline"
                textarea
                placeholder="Something short and catchy!"
                value={project.content?.headline || ""}
                nestInLabel={false}
            />

            <Input
                label="Description"
                description="The text underneath the headline. This is where you can describe your project in more detail."
                name="content.description"
                textarea rows="4"
                placeholder="Describe what your project is about."
                value={project.content?.description || ""}
                nestInLabel={false}
            />
        </div>
    )
}