import { cgen, randomId } from "../server-modules/util"


export default function Input({ label, textarea, nestInLabel = true, labelProps = {}, beforeInput, afterInput, description, ...props }: InputProps) {

    props.id ??= randomId(props.name || "input")
    props.class = cgen("rounded-md px-2 py-1 border-default focus:shadow-md transition dark:bg-neutral-800", props)

    labelProps.class = cgen("flex items-center gap-4", labelProps)

    let inputComponent = textarea ?
        <textarea rows="2" {...props}>
            {props.value}
        </textarea> :
        <input {...props} />

    if (beforeInput || afterInput) {
        inputComponent =
            <div class="flex gap-2 items-center">
                {beforeInput}
                {inputComponent}
                {afterInput}
            </div>
    }

    const labelInnerComponent =
        <div>
            <p>{label}</p>
            {description && <p class="text-xs text-light">{description}</p>}
        </div>

    return label ?
        nestInLabel ?
            <label for={props.id as string} {...labelProps}>
                {labelInnerComponent}
                {inputComponent}
            </label> :
            <>
                <label for={props.id as string} {...labelProps}>
                    {labelInnerComponent}
                </label>
                {inputComponent}
            </> :
        inputComponent
}

export type InputProps = {
    label?: string | JSX.Element
    nestInLabel?: boolean
    labelProps?: JSX.IntrinsicElements["label"]
    textarea?: boolean
    beforeInput?: JSX.Element
    afterInput?: JSX.Element
    description?: string
} & JSX.IntrinsicElements["input"] & JSX.IntrinsicElements["textarea"]
