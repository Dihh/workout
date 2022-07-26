import headComponent from './components/head/head-component.js'
import indexComponent from './components/index/index-component.js'
import footerComponent from './components/footer/footer-component.js'
import dashboardComponent from './components/dashboard/dashboard-component.js'
import exerciciosComponent from './components/exercicios/exercicios-component.js'
import treinosComponent from './components/treinos/treinos-component.js'
import datesComponent from './components/dates/dates-component.js'
import { getTemplate } from "./main.js"
import categoriasFormComponent from './components/forms/categorias/categorias-form-component.js'
import categoriasListComponent from './components/list/categorias/categorias-list-component.js'
import apiKeyFormComponent from './components/forms/api-key/api-key-form-component.js'

const { createApp } = Vue

const app = createApp({
    template: `#app-template`,
    data() {
        return {
            API_KEY: ''
        }
    },
    async mounted() {
        this.API_KEY = localStorage.API_KEY || ''
    },
    methods: {
        setApiKey(API_KEY) {
            this.API_KEY = API_KEY
        }
    }
})

async function getComponents() {
    const components = [
        { tag: 'app-head', component: headComponent, name: 'head' },
        { tag: 'app-index', component: indexComponent, name: 'index' },
        { tag: 'app-footer', component: footerComponent, name: 'footer' },
        { tag: 'app-dashboard', component: dashboardComponent, name: 'dashboard' },
        { tag: 'app-exercicios', component: exerciciosComponent, name: 'exercicios' },
        { tag: 'app-treinos', component: treinosComponent, name: 'treinos' },
        { tag: 'app-dates', component: datesComponent, name: 'dates' },
        { tag: 'app-categorias-form', component: categoriasFormComponent, name: 'categorias-form', path: 'forms/categorias' },
        { tag: 'app-categorias-list', component: categoriasListComponent, name: 'categorias-list', path: 'list/categorias' },
        { tag: 'app-api-key-form', component: apiKeyFormComponent, name: 'api-key-form', path: 'forms/api-key' },
    ]

    for (let component of components) {
        await getTemplate(component.name, component.path)
        app.component(component.tag, component.component)
    }
    app.mount('#app')
}

getComponents()