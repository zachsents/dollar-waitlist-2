import Anchor from "../components/anchor"
import Button from "../components/button"
import Footer from "../components/footer"
import PageShell from "../components/page-shell"
import TablerIcon from "../components/tabler-icon"
import { type PageProps } from "../server-modules/util"


export default function LoginPage({ req }: PageProps) {

    const signInWithLastLogin = `event.preventDefault(); signIn("${req.cookies.lastLogin}")`

    return (
        <PageShell class="bg-gray-100">
            <div class="w-screen h-screen flex justify-center items-center">
                <div class="bg-white border-default shadow-md rounded-xl p-10 flex flex-col items-stretch gap-4">
                    <h1 class="font-bold text-lg text-center">
                        Login to Dollar Waitlist
                    </h1>

                    <p class="text-sm text-light">
                        If you don't have an account, one will be created.
                    </p>

                    <Button
                        color="blue" leftIcon="brand-google-filled"
                        onclick="signIn()"
                    >
                        Sign in with Google
                    </Button>

                    {req.cookies.lastLogin &&
                        <Anchor
                            class="text-sm text-light text-center flex gap-1 items-center justify-center"
                            href="#" onclick={signInWithLastLogin}
                        >
                            <TablerIcon name="clock" />
                            <span>Sign in as {req.cookies.lastLogin}</span>
                        </Anchor>}
                </div>
            </div>

            <Footer />
        </PageShell>
    )
}