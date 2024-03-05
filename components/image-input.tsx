import { alpineJsonStringify, cgen, randomId } from "../server-modules/util"
import Button from "./button"
import { type InputProps } from "./input"

export default function ImageInput({ label, nestInLabel, labelProps, value, class: _class, ...props }: ImageInputProps) {

    props.id ??= randomId(props.name || "imageInput")

    const clickInput = "$('input', this.parentElement).click()"

    const inputComponent =
        <div
            x-data={alpineJsonStringify({ imageSource: value })}
            class={cgen("flex flex-col items-center gap-2", _class)}
        >
            <img
                x-show="imageSource"
                x-bind:src="imageSource"
                onclick={clickInput}
                class="max-h-24 rounded-lg cursor-pointer border hover:opacity-50 transition-opacity"
            />

            <Button
                color="green" type="button" 
                onclick={clickInput}
                class="text-xs"
            >
                <span x-text="imageSource ? 'Change Image' : 'Upload Image'" />
            </Button>

            <input
                {...props}
                type="file" accept="image/*" hidden
                x-on:change="imageSource = URL.createObjectURL($el.files[0])"
            />
        </div>

    return label ?
        nestInLabel ?
            <label for={props.id as string} {...labelProps}>
                <div>{label}</div>
                {inputComponent}
            </label> :
            <>
                <label for={props.id as string} {...labelProps}>
                    {label}
                </label>
                {inputComponent}
            </> :
        inputComponent
}

type ImageInputProps = {
    label: string
    nestInLabel?: boolean
    labelProps?: JSX.IntrinsicElements["label"]
    value?: string
    class?: string
} & Omit<InputProps, "label" | "type" | "value">