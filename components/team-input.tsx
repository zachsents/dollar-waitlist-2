import { alpineJsonStringify, cc, cgen } from "../server-modules/util"
import Button from "./button"
import ImageInput from "./image-input"
import Input from "./input"
import TablerIcon from "./tabler-icon"

export default function TeamInput({ id, name, avatar, title, badges, linkedin, twitter }: TeamInputProps) {

    const remove = `
        const form = this.closest('form');
        this.closest('.${cc(TeamInput)}').remove();
        htmx.trigger(form, 'change');
    `
    const moveUp = `
        const self = this.closest('.${cc(TeamInput)}');
        if(!self.previousElementSibling) return;
        self.parentNode.insertBefore(self, self.previousElementSibling);
        htmx.trigger(this.closest('form'), 'change');
    `
    const moveDown = `
        const self = this.closest('.${cc(TeamInput)}');
        if(!self.nextElementSibling) return;
        self.parentNode.insertBefore(self.nextElementSibling, self);
        htmx.trigger(this.closest('form'), 'change');
    `
    
    return (
        <div
            class={cgen(TeamInput, "grid grid-cols-[10rem_auto] gap-2 items-center")}
            x-data={alpineJsonStringify({ 
                id: id || "js:randomId('team', false)", 
            })}
        >
            <div class="flex justify-between items-center gap-4 col-span-full">
                <p class="font-bold">Team Member</p>
                <div class="flex items-center gap-1 text-xs opacity-50">
                    <Button
                        color="gray"
                        onclick={moveDown.trim()}
                    >
                        <TablerIcon name="arrow-down" />
                    </Button>
                    <Button
                        color="gray"
                        onclick={moveUp.trim()}
                    >
                        <TablerIcon name="arrow-up" />
                    </Button>
                    <Button
                        color="red"
                        onclick={remove.trim()}
                    >
                        <TablerIcon name="x" />
                    </Button>
                </div>
            </div>

            <Input
                label="Name"
                type="text"
                placeholder="Mark Zuckerberg"
                x-bind:name="`content.team.${id}.name`"
                value={name}
                nestInLabel={false}
            />

            <Input
                label="Title"
                type="text"
                placeholder="CEO, Co-Founder, etc."
                x-bind:name="`content.team.${id}.title`" 
                value={title}
                nestInLabel={false}
            />

            <Input
                label="Twitter URL"
                textarea rows="1"
                placeholder="https://twitter.com/username"
                x-bind:name="`content.team.${id}.twitter`" 
                value={twitter}
                nestInLabel={false}
            />

            <Input
                label="LinkedIn URL"
                type="text"
                placeholder="https://linkedin.com/in/username"
                x-bind:name="`content.team.${id}.linkedin`" 
                value={linkedin}
                nestInLabel={false}
            />

            <ImageInput
                label="Avatar"
                x-bind:name="`content.team.${id}.avatar`" 
                value={avatar}
                nestInLabel={false}
                class="justify-self-start"
            />

            <Input
                label="Badges"
                description="Badges displayed under the team member's name. Each line will be a new badge."
                textarea rows="3"
                placeholder="Badges"
                x-bind:name="`content.team.${id}.badges`"
                value={badges?.join("\n") || ""}
                nestInLabel={false}
            />
        </div>
    )
}

type TeamInputProps = {
    id?: string
    name?: string
    title?: string
    badges?: string[]
    twitter?: string
    linkedin?: string
    avatar?: string
}