import { Fragment } from "@kitajs/html"
import TablerIcon from "./tabler-icon"


export default function Breadcrumbs({ segments, class: classNames, ...props }: BreadcrumbProps) {
    return (
        <div class={`flex items-center gap-2 ${classNames || ""}`} {...props}>
            {segments.map((segment, i) => (
                <Fragment>
                    {i > 0 && <TablerIcon name="chevron-right" class="text-[0.75em] mt-[0.25em]" />}
                    <span class="last:font-semibold">{segment}</span>
                </Fragment>
            ))}
        </div>
    )
}

type BreadcrumbProps = {
    segments: Array<string | JSX.Element>
    class?: string
} & JSX.IntrinsicElements["div"]