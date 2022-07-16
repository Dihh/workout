// async function main() {
//     const head = await getComponent('head')
//     const index = await getComponent('index')
//     document.querySelector("#head").innerHTML = head
//     document.querySelector("#index").innerHTML = index
// }

import headComponent from './components/head/head-component.js'
import indexComponent from './components/index/index-component.js'
import { getTemplate } from "./main.js"

const { createApp } = Vue

createApp({
    template: `
        <div id="head"></div>
        <div id="index"></div>
    `,
    data() {
        return {
            head: "",
            index: "",
            message: 123
        }
    },
    async mounted() { }
}).mount('#app')

async function getComponents() {
    await getTemplate('head')
    await getTemplate('index')
    headComponent.mount("#head")
    indexComponent.mount("#index")
}

getComponents()

