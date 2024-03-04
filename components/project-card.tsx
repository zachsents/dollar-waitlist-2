import type { Project } from "../server-modules/util"

export default function ProjectCard({ id, name, _meta }: Project) {
    return (
        <a href={`/projects/${id}/edit`} class="bg-white rounded-xl border shadow-md p-4 flex flex-col gap-2 hover:scale-105 hover:shadow-lg transition cursor-pointer">
            <h3 class="font-semibold text-lg">{name}</h3>
            <p class="text-sm text-gray-500">
                Created {new Date(_meta.createTime).toLocaleDateString(undefined, {
                    dateStyle: "medium"
                })}
            </p>
        </a>
    )
}
