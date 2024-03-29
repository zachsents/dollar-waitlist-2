

export default function ThemeSettings() {
    return (
        <div class="grid grid-cols-3 items-center gap-8">
            <ThemeCard
                name="Original"
                description="The original DollarWaitlist theme. A modern, clean, flat design."
                active
            />
            <p class="text-sm text-light">
                More themes coming soon!
            </p>
        </div>
    )
}


function ThemeCard({ name, description, active }: ThemeCardProps) {
    return (
        <button
            class="bg-white rounded-lg shadow-md flex flex-col items-start gap-2 p-4 border-default data-[active]:outline data-[active]:outline-yellow-500 text-left hover:scale-105 hover:shadow-lg transition"
            {...active && { "data-active": "true" }}
            type="button"
        >
            <div class="font-bold">{name}</div>
            <p class="text-sm">
                {description}
            </p>
        </button>
    )
}

type ThemeCardProps = {
    name: string
    description: string
    active?: boolean
}
