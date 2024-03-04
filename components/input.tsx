import { randomId } from "../server-modules/util"

export default function Input({ label, description, textarea, ...props }: InputProps) {

    const id = randomId(props.name + "-")

    const isLabelElement = typeof label === "string" && label.startsWith("<")

    const inputComp = textarea ?
        <textarea
            cols="50" rows="2"
            id={id}
            {...props}
            class={`rounded-md px-2 py-1 border focus:shadow-md transition ${props.class || ""}`}
        >
            {props.value}
        </textarea> :
        <input
            id={id}
            {...props}
            class={`rounded-md px-2 py-1 border focus:shadow-md transition ${props.class || ""}`}
        />

    const wrappedInputComp = label ?
        <label for={id} class="flex items-center gap-4">
            {isLabelElement ? label : <span class="w-36">{label}</span>}
            {inputComp}
        </label> :
        inputComp

    return description ?
        <div>
            {wrappedInputComp}
            <p class="text-sm text-gray-500 mt-1">
                {description}
            </p>
        </div> :
        wrappedInputComp
}

export type InputProps = {
    label?: string | JSX.Element
    description?: string
    textarea?: boolean
} & JSX.IntrinsicElements["input"] & JSX.IntrinsicElements["textarea"]
