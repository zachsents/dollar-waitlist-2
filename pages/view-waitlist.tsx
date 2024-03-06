import Color from "color"
import Button from "../components/button"
import Footer from "../components/footer"
import Center from "../components/layout/Center"
import Group from "../components/layout/Group"
import Stack, { type StackProps } from "../components/layout/Stack"
import Menu from "../components/menu"
import PageShell from "../components/page-shell"
import TablerIcon from "../components/tabler-icon"
import { generateProjectColorCSSVariables } from "../server-modules/colors"
import { fetchProject, fetchSignupCount } from "../server-modules/firebase"
import { cgen, formatNumber, type AuthenticatedRequest, type PageProps, type Project, type ProjectBenefit, type ProjectFeature, type ProjectTeamMember } from "../server-modules/util"
import Anchor from "../components/anchor"


export default async function ViewWaitlistPage({ req }: PageProps) {

    const project = await fetchProject(req.params.projectId)

    const user = (req as AuthenticatedRequest).currentUser
    const isLoggedIn = !!user

    const links = <>
        <NavLink href="#features" class="py-0.5">Features</NavLink>
        <NavLink href="#benefits" class="py-0.5">Benefits</NavLink>
        <NavLink href="#tweets" class="py-0.5">Tweets</NavLink>
        <NavLink href="#team" class="py-0.5">Team</NavLink>
    </>

    const projectColors = project.colors?.primary ?
        generateProjectColorCSSVariables(project.colors.primary) :
        {}

    return (
        <PageShell
            class="bg-gray-50 pb-40"
            style={projectColors}
            afterBody={twitterScript.trim()}
        >
            <div class="w-full h-full absolute top-0 left-0 lg:glowy-bg opacity-30" />

            <header class="fixed z-30 top-0 left-0 w-full px-8 py-4">
                <Group noWrap class="gap-10 justify-between max-w-7xl mx-auto w-full">
                    <Brand project={project} />

                    <Group noWrap class="hidden lg:flex gap-8">
                        {links}
                    </Group>

                    <Menu label={<div class="p-2">
                        <TablerIcon name="menu-2" />
                    </div>} class="lg:hidden">
                        {links}
                    </Menu>
                </Group>
            </header>

            <div class="px-8 lg:px-20">
                <div class="flex relative gap-20 justify-center w-full max-w-6xl mx-auto">
                    <div class="py-20 flex-1">
                        <Stack class="gap-36 w-full">
                            <Stack class="mt-20 lg:mt-24 gap-4">
                                {project.content?.eyebrow &&
                                    <p class="font-bold text-[var(--wl-primary-dark)]">
                                        {project.content.eyebrow}
                                    </p>}
                                {project.content?.headline &&
                                    <h1 class="font-bold text-5xl">
                                        {project.content.headline}
                                    </h1>}
                                {project.content?.description &&
                                    <p class="text-xl">
                                        {project.content.description}
                                    </p>}
                            </Stack>

                            {project.content?.features &&
                                <Stack class="gap-10 scroll-m-20" id="features">
                                    <SectionLabel label="Features" />
                                    <div class="columns-1 lg:columns-2 max-w-3xl mx-auto gap-8">
                                        {Object.values(project.content.features)
                                            .sort((a, b) => a.order - b.order)
                                            .map(feature =>
                                                <Feature feature={feature} />
                                            )}
                                    </div>
                                </Stack>}

                            {project.content?.benefits &&
                                <Stack class="gap-10 scroll-m-20" id="benefits">
                                    <SectionLabel label="Benefits" />
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-16">
                                        {Object.values(project.content.benefits)
                                            .sort((a, b) => a.order - b.order)
                                            .map(benefit =>
                                                <Benefit benefit={benefit} />
                                            )}
                                    </div>
                                </Stack>}

                            {project.content?.tweets?.length > 0 &&
                                <Stack class="gap-10 scroll-m-20" id="tweets">
                                    <SectionLabel label="Tweets" />
                                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                        {project.content?.tweets?.map(url =>
                                            <Tweet url={url} />
                                        )}
                                    </div>
                                </Stack>}

                            {project.content?.team &&
                                <Stack class="gap-10 scroll-m-20" id="team">
                                    <SectionLabel label="Team" />
                                    <div class="grid grid-cols-1 gap-10">
                                        {Object.values(project.content.team)
                                            .sort((a, b) => a.order - b.order)
                                            .map(member =>
                                                <TeamMemberCard member={member} />
                                            )}
                                    </div>
                                </Stack>}
                            <hr />
                        </Stack>
                    </div>

                    <JoinCard project={project} />
                </div>
            </div>

            <Footer class="justify-center">
                <p class="text-sm text-lighter">
                    This site was made with Dollar Waitlist 💸
                </p>
                <Footer.Link href="https://dollarwaitlist.com">Create your own</Footer.Link>
            </Footer>

            {isLoggedIn &&
                <div class="hidden lg:flex fixed z-50 bottom-0 right-4 rounded-t-md px-4 py-2 bg-white border-default items-center gap-4 text-sm shadow-md">
                    <span class="text-light">
                        Hey {user.name || user.email}! 👋
                    </span>
                    <Anchor href="/projects">
                        Go to Dashboard
                    </Anchor>
                </div>}
        </PageShell>
    )
}

function Brand({ project }: { project: Project }) {
    const logoComponent =
        <img
            src={project.logo}
            alt={`${project.name} logo`}
            class="h-9 w-auto aspect-square shrink-0"
        />

    return (
        <a
            href="#" class="hover:opacity-100 transition-opacity"
            {...{
                "x-data": "{ atTop: true }",
                "@scroll.window": "atTop = document.documentElement.scrollTop < 25",
                "x-bind:class": "{ 'opacity-100': atTop, 'opacity-30': !atTop }",
            }}
        >
            {project.onlyShowLogo ?
                logoComponent :
                <Group noWrap class="gap-4">
                    {logoComponent}
                    <span class="font-bold text-xl">{project.name}</span>
                </Group>}
        </a>
    )
}

function NavLink({ children, ...props }: JSX.IntrinsicElements["a"]) {
    return (
        <a
            {...props}
            class={cgen("hover:text-[var(--wl-primary)]", props)}
        >
            {children}
        </a>
    )
}


function SectionLabel({ label = "" }: { label: string }) {
    return (
        <div
            class="flex justify-end items-center gap-8 sticky top-20 lg:top-10 z-10 pointer-events-none"
        >
            <span
                class="text-center text-light text-sm uppercase font-bold p-4 rounded-full border-[1px] border-gray-300 border-dashed cursor-pointer hover:text-dark hover:border-dark transition"
            >
                {label}
            </span>
        </div>
    )
}


function Feature({ feature, ...props }: { feature: ProjectFeature } & StackProps) {

    const imgComponent = <img src={feature.image} />

    return (
        <Stack
            {...props}
            class={cgen("break-inside-avoid-column gap-4 mt-12 lg:mt-0", props)}
        >
            {feature.addGradient ?
                <GradientImage color={feature.gradientColor}>
                    {imgComponent}
                </GradientImage> :
                imgComponent}

            <div
                class="bg-white border-default rounded-xl p-4 text-center shadow-sm"
            >
                <Group class="justify-center gap-2 text-lg">
                    <TablerIcon name={feature.icon} />
                    <p>{feature.title}</p>
                </Group>
                {feature.description &&
                    <p class="text-sm text-light">{feature.description}</p>}
            </div>
        </Stack>
    )
}


function GradientImage({ children, color }: { children: any, color: string }) {

    const firstColor = Color(color).rotate(-20)
    const secondColor = Color(color).rotate(20)

    return (
        <div class="w-full p-6 rounded-lg shadow-sm" style={{
            backgroundImage: `linear-gradient(to bottom right, ${firstColor}, ${secondColor})`,
        }}>
            <div class="rounded-lg overflow-clip rotate-3 flex items-center justify-center">
                {children}
            </div>
        </div>
    )
}


function Benefit({ benefit }: { benefit: ProjectBenefit }) {
    return (
        <Stack class="!items-center gap-4 border-default px-4 py-10 bg-white rounded-xl shadow-sm">
            <div class="flex items-center justify-center rounded-2xl bg-[var(--wl-primary-light-2)] text-[var(--wl-primary-dark)] w-20 h-auto aspect-square text-4xl">
                <TablerIcon name={benefit.icon} />
            </div>

            <h3 class="text-xl font-medium text-center -mb-2">
                {benefit.title}
            </h3>
            {benefit.description &&
                <p class="text-center">
                    {benefit.description}
                </p>}
        </Stack>
    )
}


function Tweet({ url }: { url: string }) {
    const id = url.split("/").pop()
    return (
        <div
            id={id}
            class="[&_.twitter-tweet]:!my-0 [&_.twitter-tweet]:!mx-auto"
            x-data="{ loaded: false }"
            x-init={`twttr.ready(async x => { await x.widgets.createTweet('${id}', $el, { conversation: 'none' }); loaded = true })`}
        >
            <div
                x-show="!loaded"
                class="bg-gray-100 rounded-xl animate-pulse border-default h-36 flex items-center justify-center text-sm text-light"
            >
                Loading tweet...
            </div>
        </div>
    )
}


const twitterScript = `
<script>window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
      t = window.twttr || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
        js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
  
    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };
  
    return t;
  }(document, "script", "twitter-wjs"));</script>
`


function TeamMemberCard({ member: { avatar, name, title, linkedin, twitter, badges } }: { member: ProjectTeamMember }) {

    const badgeGroup =
        <Group class="gap-1 mt-2 justify-center lg:justify-start">
            {badges.map((badge) =>
                <div class="text-xs lg:text-sm font-bold uppercase py-1 px-3 rounded-full bg-[var(--wl-primary-light-2)] text-[var(--wl-primary-dark)]">
                    {badge}
                </div>
            )}
        </Group>

    return (
        <div class="bg-white border-default rounded-xl shadow-sm px-4 py-10 lg:px-10">
            <div class="flex items-center flex-col lg:flex-row justify-between gap-2">
                <Group noWrap class="!gap-8">
                    <img src={avatar} class="h-20 w-auto aspect-square rounded-full shrink-0" />

                    <div>
                        <p class="font-medium text-lg">{name}</p>
                        <p class="text-light">{title}</p>

                        <div class="hidden lg:block">
                            {badgeGroup}
                        </div>
                    </div>
                </Group>

                <div class="lg:hidden">
                    {badgeGroup}
                </div>

                <Group noWrap class="text-xl gap-0">
                    {linkedin &&
                        <SocialLink
                            icon="brand-linkedin"
                            href={linkedin}
                        />}
                    {twitter &&
                        <SocialLink
                            icon="brand-twitter"
                            href={twitter}
                        />}
                </Group>
            </div>
        </div>
    )
}


function SocialLink({ icon, ...props }: { icon: string } & JSX.IntrinsicElements["a"]) {
    return (
        <a
            {...props}
            class={cgen("text-3xl text-gray-500 hover:text-[var(--wl-primary)] flex justify-center items-center px-2 py-4", props)}
            target="_blank" rel="noreferrer"
        >
            <TablerIcon name={icon} />
        </a>
    )
}


function JoinCard({ project }: { project: Project }) {
    return (<>
        <div
            class="hidden lg:flex grow max-w-[24rem] h-screen sticky z-20 top-0 py-12 flex-col gap-16 justify-center"
        >
            <Center
                class="border-default bg-white w-full relative rounded-3xl shadow-lg px-8 py-16"
            >
                <JoinForm project={project} />
            </Center>
        </div>

        <Center
            class="lg:hidden fixed left-0 top-0 w-screen h-screen z-[100] pointer-events-none px-xl"
            x-data="{ open: false }"
            x-cloak
        >
            <div
                class="fixed z-[1] transition-opacity bg-gray-900 w-full h-full"
                {...{
                    ":class": "{ 'opacity-50 duration-500 pointer-events-auto': open, 'opacity-0 pointer-events-none': !open }",
                    "@click": "open = false",
                }}
            />

            <div
                class="z-[2] pointer-events-auto transition-transform w-[90%]"
                {...{
                    ":style": "{ transform: `translateY(${open ? '0px' : 'calc(50vh + 50% - 8rem)'})` }",
                    "@click": "open = true",
                }}
            >
                <Center
                    class="border-default bg-white w-full relative rounded-xl shadow-lg px-8 py-16"
                >
                    <JoinForm project={project} />
                    <TablerIcon
                        x-show="!open"
                        name="hand-click"
                        class="absolute top-0 right-0 m-4 animate-pulse text-xl -rotate-12"
                    />
                </Center>
            </div>
        </Center>
    </>)
}


async function JoinForm({ project }: { project: Project }) {

    const signupCount = await fetchSignupCount(project.id)

    const isWaitlistFull = (signupCount >= project.signupGoal)
        && !project.allowOverflowSignups
        && project.hasSignupGoal

    return (
        <div
            class="w-full max-w-xs"
            x-data={`{ lastEmail: localStorage.getItem('dwsignup-${project.id}') }`}
            x-cloak
        >
            <Stack x-show="lastEmail">
                <Group noWrap class="text-2xl justify-center my-md">
                    <TablerIcon name="check" />
                    <p class="font-bold whitespace-nowrap">
                        You're signed up!
                    </p>
                </Group>
                <p x-text="lastEmail" class="text-center text-light" />
                <p class="text-center text-light">
                    Watch your inbox for updates.
                </p>
            </Stack>

            {isWaitlistFull ?
                <Stack x-show="!lastEmail">
                    <Group noWrap class="text-2xl justify-center my-md">
                        <TablerIcon name="gift" />
                        <p class="font-bold whitespace-nowrap">
                            That's a wrap!
                        </p>
                    </Group>
                    <p class="text-center text-light">
                        The waitlist is full.
                    </p>
                </Stack> :
                <Stack x-show="!lastEmail" class="gap-6">
                    <div>
                        <Group noWrap class="text-2xl justify-center my-md">
                            <TablerIcon name="ballpen" />
                            <p class="font-bold whitespace-nowrap">
                                Join the waitlist!
                            </p>
                        </Group>
                        <p class="text-center text-light">
                            You'll get early access to the app.
                        </p>
                    </div>

                    <div class="flex flex-col items-stretch gap-4">
                        <Button
                            color=""
                            class="bg-[var(--wl-primary)] self-center text-lg font-bold"
                            href={`/projects/${project.id}/signup`}
                            rightIcon="external-link"
                        >
                            <span>Join Waitlist</span>
                            <span>$1</span>
                        </Button>
                        {/* <div class="flex items-center gap-1 flex-nowrap justify-center">
                            <span class="text-xs text-light">Powered by</span>
                            <TablerIcon name="brand-stripe" class="text-violet-600 text-xs" />
                            <span class="text-violet-600 text-xs">
                                Stripe
                            </span>
                        </div> */}
                    </div>
                </Stack>}

            <Stack class="mt-10 gap-2">
                <p class="text-center font-bold">
                    {signupCount > 0 ?
                        `${formatNumber(signupCount)} signed up!` :
                        "Be the first to sign up!"}
                </p>

                {project.hasSignupGoal &&
                    <div>
                        <div class="h-4 w-full rounded-full bg-gray-300 overflow-clip">
                            <div
                                class="h-full rounded-full max-w-full bg-[var(--wl-primary)]"
                                style={{ width: `${Math.min(Math.round(((signupCount || 0) / project.signupGoal) * 100), 100)}%` }}
                            />
                        </div>

                        <p class="text-light text-sm mt-1 mr-xs text-right">
                            {formatNumber(signupCount || 0)} / {formatNumber(project.signupGoal)}
                        </p>
                    </div>}
            </Stack>
        </div>

    )
}