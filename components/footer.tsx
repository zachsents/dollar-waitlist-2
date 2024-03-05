import { cgen } from "../server-modules/util"
import Anchor, { type AnchorProps } from "./anchor"
import TablerIcon from "./tabler-icon"


export default function Footer({ children, ...props }: FooterProps) {

    return (
        <footer
            {...props}
            class={cgen("absolute w-full bottom-0 px-8 py-4 flex items-center gap-8", props)}
        >
            {children || <>
                <FooterLink href="https://x.com/ZachSents">
                    Made by @ZachSents
                </FooterLink>
                <FooterLink href="https://workflow.dog">
                    Build a no-code backend with WorkflowDog
                </FooterLink>
            </>}
        </footer>
    )
}

type FooterProps = {
    children?: JSX.Element | JSX.Element[]
} & JSX.IntrinsicElements["footer"]


function FooterLink({ children, ...props }: FooterLinkProps) {
    return (
        <Anchor
            target="_blank"
            {...props}
            class={cgen("text-sm text-lighter flex gap-1 items-center flex-nowrap", props)}
        >
            <span>{children}</span>
            <TablerIcon name="external-link" />
        </Anchor>
    )
}

type FooterLinkProps = {
    children: string
    href: string
} & AnchorProps

Footer.Link = FooterLink