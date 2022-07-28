import headComponent from './components/head/head-component.js'
import indexComponent from './components/index/index-component.js'
import footerComponent from './components/footer/footer-component.js'
import dashboardComponent from './components/dashboard/dashboard-component.js'
import workoutListComponent from './components/list/workout/workout-component.js'
import datesComponent from './components/dates/dates-component.js'
import { getTemplate } from "./main.js"
import categoriasFormComponent from './components/forms/categorias/categorias-form-component.js'
import categoriasListComponent from './components/list/categorias/categorias-list-component.js'
import apiKeyFormComponent from './components/forms/api-key/api-key-form-component.js'
import categoriaComponent from './components/pages/categoria/categoria-component.js'
import exerciseComponent from './components/pages/exercise/exercise-component.js'
import exercisesListComponent from './components/list/exercises/exercises-list-component.js'
import exerciseFormComponent from './components/forms/exercise/exercise-form-component.js'
import workoutFormComponent from './components/forms/workout/workout-form-component.js'
import workoutComponent from './components/pages/workout/workout-component.js'

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
        { tag: 'app-dates', component: datesComponent, name: 'dates' },
        { tag: 'app-workout-list', component: workoutListComponent, name: 'workout', path: 'list/workout' },
        { tag: 'app-categorias-form', component: categoriasFormComponent, name: 'categorias-form', path: 'forms/categorias' },
        { tag: 'app-exercise-form', component: exerciseFormComponent, name: 'exercise-form', path: 'forms/exercise' },
        { tag: 'app-workout-form', component: workoutFormComponent, name: 'workout-form', path: 'forms/workout' },
        { tag: 'app-categorias-list', component: categoriasListComponent, name: 'categorias-list', path: 'list/categorias' },
        { tag: 'app-exercises-list', component: exercisesListComponent, name: 'exercises-list', path: 'list/exercises' },
        { tag: 'app-api-key-form', component: apiKeyFormComponent, name: 'api-key-form', path: 'forms/api-key' },
        { tag: 'app-categoria', component: categoriaComponent, name: 'categoria', path: 'pages/categoria' },
        { tag: 'app-exercise', component: exerciseComponent, name: 'exercise', path: 'pages/exercise' },
        { tag: 'app-workout', component: workoutComponent, name: 'workout', path: 'pages/workout' },
    ]

    for (let component of components) {
        await getTemplate(component.name, component.path)
        app.component(component.tag, component.component)
    }
    app.mount('#app')
}

getComponents()