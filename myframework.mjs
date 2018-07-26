import { render } from './micromustache.mjs'

export class MyFramework {
    constructor(rootId, vm, auto = true) {
        this.$rootElement = document.getElementById(rootId)
        this.$vm = vm
        if (auto) {
            document.querySelectorAll('template').forEach(template => {
                this.defineComponent({ templateId: template.id })
            })
        }
    }

    $lookupFromVm(path) {
        return eval('this.$vm.' + path)
    }

    async $getTemplate(templateId) {
        const ret = document.getElementById(templateId)
        if (ret) {
            return ret.innerHTML
        }
        const response = await fetch(templateId)
        return response.text()
    }

    $addStyleLink(url) {
        // <link rel="stylesheet" href="site-header.css">
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = url
        document.head.appendChild(link)
    }

    async defineComponent({ templateId, tagId = templateId, css }) {
        const template = await this.$getTemplate(templateId)
        if (css) {
            this.$addStyleLink(css)
        }

        app.querySelectorAll(tagId).forEach(componentUsage => {
            const data = this.$lookupFromVm(componentUsage.dataset.path) || {}
            data.innerText = componentUsage.innerText
            const componentUsageRender = render(template, data)
            componentUsage.innerHTML = componentUsageRender
            const method = this.$lookupFromVm(componentUsage.dataset.method) || {}
            for (let m in method) {
                componentUsage[m] = method[m]
            }
        })
    }
}