import Anchor from "../components/anchor"
import Breadcrumbs from "../components/breadcrumbs"
import Button from "../components/button"
import CopyButton from "../components/copy-button"
import Footer from "../components/footer"
import Header from "../components/header"
import PageShell from "../components/page-shell"
import SettingsContainer from "../components/settings-container"
import Tabs from "../components/tabs"
import { fetchProject } from "../server-modules/firebase"
import { settingsTabLabels, type PageProps, SettingsTabs } from "../server-modules/util"


export default async function EditProjectPage({ req }: PageProps) {

    const currentTab = req.params.tab as SettingsTabs
    const project = await fetchProject(req.params.projectId, ["name"])

    const SettingsComponent = require(`../components/edit-project-form/${currentTab}`).default

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
                        <Anchor href={`/projects/${project.id}/settings`}>
                            {project.name}
                        </Anchor>,
                        <Anchor href={`/projects/${project.id}/settings/${currentTab}`}>
                            {settingsTabLabels[currentTab]}
                        </Anchor>,
                    ]}
                />

                <div class="flex items-center gap-8">
                    <h1
                        id="project-title"
                        class="text-3xl font-bold"
                        hx-get={`/api/projects/${req.params.projectId}/name`}
                        hx-trigger="change"
                    >
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
                    tabs={Object.values(SettingsTabs).map(tab =>
                        <Tabs.Tab
                            href={`/projects/${project.id}/settings/${tab}`}
                            value={tab}
                        >
                            {settingsTabLabels[tab]}
                        </Tabs.Tab>
                    )}
                    currentTab={currentTab}
                >
                    <SettingsContainer title={settingsTabLabels[currentTab]} >
                        <SettingsComponent projectId={project.id} />
                    </SettingsContainer>
                </Tabs>
            </div>

            <Footer />
        </PageShell>
    )
}


