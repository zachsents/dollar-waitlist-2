import Color from "color"


export function generateProjectColorCSSVariables(primaryColor: string) {

    const primary = Color(primaryColor)
    const secondary = Color(primaryColor)

    return {
        "--wl-primary": primary,
        "--wl-primary-light": primary.lightness(65),
        "--wl-primary-light-2": primary.lightness(85),
        "--wl-primary-dark": primary.lightness(30).saturate(1),
        "--wl-secondary": secondary,
        "--wl-secondary-light": secondary.lightness(65),
        "--wl-secondary-light-2": secondary.lightness(85),
        "--wl-secondary-dark": secondary.lightness(25).saturate(1),
    }
}

