import Anchor from "../components/anchor"
import Breadcrumbs from "../components/breadcrumbs"
import Button from "../components/button"
import CopyButton from "../components/copy-button"
import Footer from "../components/footer"
import Header from "../components/header"
import PageShell from "../components/page-shell"
import Tabs from "../components/tabs"
import { fetchProject } from "../server-modules/firebase"
import type { PageProps } from "../server-modules/util"


export default async function EditProjectPage({ req }: PageProps) {

    const tab = req.params.tab
    const project = await fetchProject(req.params.projectId)

    return (
        <PageShell bodyClass="bg-gray-100 pb-40">
            <Header />

            <div class="px-8 max-w-5xl mx-auto flex flex-col gap-8 items-stretch">
                <Breadcrumbs
                    class="text-sm text-gray-500"
                    segments={[
                        <Anchor href="/">
                            Projects
                        </Anchor>,
                        <Anchor href={`/projects/${project.id}/edit`}>
                            {project.name}
                        </Anchor>,
                    ]}
                />

                <div class="flex items-center gap-8">
                    <h1 id="project-title" class="text-3xl font-bold">
                        {project.name}
                    </h1>

                    <div class="flex items-center gap-4">
                        <Button
                            color="green" rightIcon="external-link"
                            class="text-xs"
                            href={`/projects/${project.id}`} target="_blank"
                        >
                            View Live Site
                        </Button>

                        <CopyButton
                            label="Copy Link"
                            class="text-xs"
                            content={`location.origin + "/projects/${project.id}"`}
                        />
                    </div>
                </div>

                <hr />

                <Tabs
                    tabs={[
                        { value: "general", content: "General" },
                        { value: "theme", content: "Theme" },
                        { value: "signups", content: "Signups" },
                        { value: "main-content", content: "Hero" },
                        { value: "features", content: "Features" },
                        { value: "benefits", content: "Benefits" },
                        { value: "tweets", content: "Tweets" },
                        { value: "team", content: "Team" },
                    ]}
                    hx-get={`/api/projects/${project.id}/settings`}
                />
            </div>

            <Footer />
        </PageShell>
    )
}


