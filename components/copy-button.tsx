import Button, { type ButtonProps } from "./button"

export default function CopyButton({ label = "Copy", content, ...props }: CopyButtonProps) {

    const handleCopy = `
        navigator.clipboard.writeText(${content})
        copied = true
        setTimeout(() => copied = false, 1000)
    `
    
    return (
        <div x-data="{ copied: false }">
            <Button
                color="blue"
                leftIcon="copy"
                {...props}
                
                x-on:click={handleCopy.trim()}
                x-show="!copied"
            >
                {label}
            </Button>
            <Button
                color="green"
                leftIcon="check"
                {...props}

                x-show="copied"
                /*
                    Alpine takes a second to initialize, so the button shows for
                    a second. This style hides it immediately. Can't use tailwind
                    classes because they override what Alpine does.
                */
                style={{ display: "none" }}
            >
                Copied
            </Button>
        </div>
    )
}

type CopyButtonProps = {
    label?: string
    content: string
} & Partial<ButtonProps>