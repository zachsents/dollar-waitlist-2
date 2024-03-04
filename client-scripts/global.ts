import "../client-modules/firebase"


function quickQuerySelector(selector: string, parent: Element | Document = document) {
    return parent.querySelector(selector)
}

function quickQuerySelectorAll(selector: string, parent: Element | Document = document) {
    return Array.from(parent.querySelectorAll(selector))
}

window.onload = () => {
    window.$ = quickQuerySelector
    window.$$ = quickQuerySelectorAll
}

declare global {
    interface Window {
        $: (selector: string) => Element | null
        $$: (selector: string) => Array<Element>
    }
}