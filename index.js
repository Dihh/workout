// async function main() {
//     const head = await getComponent('head')
//     const index = await getComponent('index')
//     document.querySelector("#head").innerHTML = head
//     document.querySelector("#index").innerHTML = index
// }

import headComponent from './components/head/head-component.js'
import indexComponent from './components/index/index-component.js'
import footerComponent from './components/footer/footer-component.js'
import dashboardComponent from './components/dashboard/dashboard-component.js'
import exerciciosComponent from './components/exercicios/exercicios-component.js'
import treinosComponent from './components/treinos/treinos-component.js'
import categoriasComponent from './components/categorias/categorias-component.js'
import { getTemplate } from "./main.js"

const { createApp } = Vue

createApp({
    template: `#app-template`,
    data() {
        return {}
    },
    async mounted() { }
}).mount('#app')

async function getComponents() {
    await getTemplate('head')
    await getTemplate('index')
    await getTemplate('footer')
    await getTemplate('dashboard')
    await getTemplate('exercicios')
    await getTemplate('treinos')
    await getTemplate('categorias')

    headComponent.mount("#head")
    indexComponent.mount("#index")
    footerComponent.mount("#footer")
    dashboardComponent.mount("#dashboard")
    exerciciosComponent.mount("#exercicios")
    treinosComponent.mount("#treinos")
    categoriasComponent.mount("#categorias")

}

getComponents()

