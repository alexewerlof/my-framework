import { MyFramework } from './myframework.mjs'

const vm = {
    pageTitle: 'Top news',
    news: [
        {
            title: 'This is awesome',
            body: 'Alex said this is really really awesome and we believe that.'
        },
        {
            title: 'HTML can do a lot',
            body: 'You will be amazed to see how much the basic HTML can do for you!'
        }
    ]
}

const myFramework = new MyFramework('app', vm)
myFramework.defineComponent('news-item')
myFramework.defineComponent('cta-button')
