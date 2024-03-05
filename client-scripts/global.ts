import "../client-modules/firebase"


function quickQuerySelector(selector: string, parent: Element | Document = document) {
    return parent.querySelector(selector)
}

function quickQuerySelectorAll(selector: string, parent: Element | Document = document) {
    return Array.from(parent.querySelectorAll(selector))
}

function randomId(prefix?: string, withDash = true) {
    const rand = Math.random().toString(36).substring(2, 10)
    return `${prefix ? withDash ? `${prefix}-` : prefix : ""}${rand}`
}

window.onload = () => {
    window.$ = quickQuerySelector
    window.$$ = quickQuerySelectorAll
    window.randomId = randomId
}

declare global {
    interface Window {
        $: (selector: string) => Element | null
        $$: (selector: string) => Array<Element>
        randomId: typeof randomId
    }
}