import Anchor from "./anchor"
import TablerIcon from "./tabler-icon"


export default function Footer() {

    return (
        <footer class="absolute w-full bottom-0 px-8 py-4 flex items-center gap-8">
            <FooterLink href="https://x.com/ZachSents">
                Made by @ZachSents
            </FooterLink>
            <FooterLink href="https://workflow.dog">
                Build a no-code backend with WorkflowDog
            </FooterLink>
        </footer>
    )
}

function FooterLink({ children, href }: { children: JSX.Element, href: string }) {
    return (
        <Anchor
            href={href} target="_blank"
            class="text-sm text-lighter flex gap-1 items-center"
        >
            <span>{children}</span>
            <TablerIcon name="external-link" />
        </Anchor>
    )
}