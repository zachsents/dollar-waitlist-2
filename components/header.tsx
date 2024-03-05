import Anchor from "../components/anchor"
import Menu from "../components/menu"


export default function Header() {
    return (
        <header id="header" hx-preserve class="px-8 py-4">
            <nav class="flex gap-4 justify-between items-center">
                <div class="flex gap-8 items-center justify-start">
                    <a href="/" class="flex gap-2 items-center text-lg group">
                        <img
                            src="/logo.png" alt="Dollar Waitlist logo"
                            class="h-[1.5em]"
                        />
                        <span class="font-semibold group-hover:text-green-600 transition-colors">
                            Dollar Waitlist
                        </span>
                    </a>

                    <Anchor href="/projects">
                        Projects
                    </Anchor>
                </div>

                <div class="flex gap-4 items-center justify-end">
                    <Menu label={
                        <div class="text-sm">
                            <span class="text-light">Hey</span>{" "}
                            <span hx-get="/api/user/displayName" hx-trigger="load" />
                        </div>
                    }>
                        {/* <Anchor href="/account" class="text-right text-sm">
                            My Account
                        </Anchor> */}
                        <Anchor href="/logout" class="text-right text-sm">
                            Sign Out
                        </Anchor>
                    </Menu>
                </div>
            </nav>
        </header>
    )
}