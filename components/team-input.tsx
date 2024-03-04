import { alpineJsonStringify } from "../server-modules/util"
import ImageInput from "./image-input"
import Input from "./input"
import TablerIcon from "./tabler-icon"

export default function TeamInput({ name, avatar, title, badges, linkedin, twitter }: TeamInputProps) {

    return (
        <div
            class="component-team-input flex flex-col gap-1 items-stretch"
            x-data={alpineJsonStringify({ 
                name, title, linkedin, twitter,
                badges: badges?.join?.("\n"),
            })}
        >
            <div class="flex items-center gap-4">
                <button
                    class="opacity-50 hover:opacity-100 hover:text-red-500"
                    onclick="this.closest('.component-benefit-input').remove()"
                >
                    <TablerIcon name="x" />
                </button>
                <p class="font-bold">Team Member</p>
            </div>

            <Input
                label="Name"
                type="text"
                placeholder="Mark Zuckerberg"
                x-model="name"
            />

            <Input
                label="Title"
                type="text"
                placeholder="CEO, Co-Founder, etc."
                x-model="title"
            />

            <Input
                label="Twitter URL"
                textarea rows="1"
                placeholder="https://twitter.com/username"
                x-model="twitter"
            />

            <Input
                label="LinkedIn URL"
                textarea rows="1"
                placeholder="https://linkedin.com/in/username"
                x-model="linkedin"
            />

            <ImageInput
                label="Avatar"
                name="avatar"
                value={avatar}
                class="team-input-avatar"
            />

            <Input
                label="Badges"
                description="Badges displayed under the team member's name. Each line will be a new badge."
                textarea rows="3"
                placeholder="Badges"
                x-model="badges"
            />

            <input 
                hidden 
                x-bind:name="Boolean(name || title || badges || linkedin || twitter) && 'content.team'"
                x-bind:value="JSON.stringify({ name, title, linkedin, twitter, badges })"
            />
        </div>
    )
}

type TeamInputProps = {
    name?: string
    title?: string
    badges?: string[]
    twitter?: string
    linkedin?: string
    avatar?: string
}