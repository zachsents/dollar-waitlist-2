import LoadingSpinner from "../components/loading-spinner"
import Footer from "../components/footer"
import Header from "../components/header"
import PageShell from "../components/page-shell"
import Button from "../components/button"


export default function IndexPage() {
    return (
        <PageShell class="bg-gray-100 pb-40">
            <Header />

            <div class="px-8 max-w-5xl mx-auto flex flex-col gap-8 items-stretch">
                <div class="flex items-center justify-between">
                    <h1 class="text-3xl font-bold">
                        Projects
                    </h1>

                    <Button
                        color="green" leftIcon="plus"
                        hx-post="#"
                        hx-prompt="Name your new project (you can change this later)"
                        htmx="parent"
                    >
                        New Project
                    </Button>
                </div>

                <LoadingSpinner
                    htmx="self"
                    hx-get="/api/projects"
                    hx-trigger="load"
                    hx-swap="outerHTML"
                    includeWrapper
                />
            </div>

            <Footer />
        </PageShell>
    )
}