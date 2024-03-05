import type { Project } from "../server-modules/util"
import LoadingSpinner from "./loading-spinner"

export default function ProjectCard({ id, name, _meta }: Project) {
    return (
        <a
            hx-boost="true"
            href={`/projects/${id}/settings`}
            class="bg-white rounded-xl border-default shadow-md p-4 hover:scale-105 hover:shadow-lg transition cursor-pointer flex justify-between items-center gap-4"
        >
            <div class="flex flex-col gap-2">
                <h3 class="font-semibold text-lg">{name}</h3>
                <p class="text-sm text-light">
                    Created {new Date(_meta.createTime).toLocaleDateString(undefined, {
                        dateStyle: "medium"
                    })}
                </p>
            </div>

            <LoadingSpinner htmx="parent" class="text-lighter" size={18} />
        </a>
    )
}
