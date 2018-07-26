import { render } from './micromustache.mjs'

export class MyFramework {
    constructor(rootId, vm) {
        this.$rootElement = document.getElementById(rootId)
        this.$vm = vm
    }

    $lookupFromVm(path) {
        return eval('this.$vm.' + path)
    }

    defineComponent(templateId, tagId = templateId) {
        const template = document.getElementById(templateId)

        app.querySelectorAll(tagId).forEach(componentUsage => {
            const data = this.$lookupFromVm(componentUsage.dataset.path) || {}
            data.innerText = componentUsage.innerText
            const componentUsageRender = render(template.innerHTML, data)
            componentUsage.innerHTML = componentUsageRender
        })
    }
}