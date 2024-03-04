import type { Project } from "../server-modules/util"
import ProjectCard from "./project-card"

export default function ProjectCardList({ projectList }: ProjectCardListProps) {
    return projectList?.length > 0 ?
        <div class="grid grid-cols-3 gap-4">
            {projectList.map(project => (
                <ProjectCard key={project.id} {...project} />
            ))}
        </div> :
        <p class="text-small text-gray-500 text-center">
            No projects found.
        </p>
}

type ProjectCardListProps = {
    projectList: Project[]
}