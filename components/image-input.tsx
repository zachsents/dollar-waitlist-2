import { alpineJsonStringify } from "../server-modules/util"
import Button from "./button"
import Input, { type InputProps } from "./input"

export default function ImageInput({ label, value, ...props }: ImageInputProps) {

    return (
        <div x-data={alpineJsonStringify({ 
            inputValue: "",
        })}>
            <Input
                label={<>
                    <span class="w-36">{label}</span>

                    <div class="flex flex-col items-center gap-2">
                        <span x-show="inputValue" class="text-sm text-gray-500">
                            Selected{" "}
                            <span
                                x-text="inputValue?.split('\\\\').pop() || 'Image selected'"
                            />
                        </span>

                        {value ?
                            <>
                                <img
                                    src={value} class="max-h-20 rounded-lg cursor-pointer hover:opacity-50 transition-opacity"
                                    x-show="!inputValue"
                                />
                                <Button
                                    color="green"
                                    type="button"
                                    onclick="this.parentElement.click()"
                                    class="text-xs"
                                >
                                    Change Image
                                </Button>
                            </> :
                            <Button
                                color="green"
                                type="button"
                                onclick="this.parentElement.click()"
                                class="text-sm"
                            >
                                Upload Image
                            </Button>}
                    </div>
                </>}
                type="file"
                accept="image/*"
                {...props}
                class={`hidden ${props.class || ""}`}

                x-model="inputValue"
            />
        </div>
    )
}

type ImageInputProps = {
    label: string
    value?: string
} & Omit<InputProps, "label" | "type" | "value">