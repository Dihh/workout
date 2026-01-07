import headComponent from './components/head/head-component.js'
import indexComponent from './components/index/index-component.js'
import footerComponent from './components/footer/footer-component.js'
import dashboardComponent from './components/dashboard/dashboard-component.js'
import dayWorkoutListComponent from './components/list/days-workouts/days-workouts-component.js'
import datesComponent from './components/dates/dates-component.js'
import { getTemplate } from "./main.js"
import categoriasFormComponent from './components/forms/categorias/categorias-form-component.js'
import categoriasListComponent from './components/list/categorias/categorias-list-component.js'
import apiKeyFormComponent from './components/forms/api-key/api-key-form-component.js'
import categoriaComponent from './components/pages/categoria/categoria-component.js'
import exerciseComponent from './components/pages/exercise/exercise-component.js'
import exercisesListComponent from './components/list/exercises/exercises-list-component.js'
import exerciseFormComponent from './components/forms/exercise/exercise-form-component.js'
import dayWorkoutFormComponent from './components/forms/day-workout/day-workout-form-component.js'
import dayWorkoutComponent from './components/pages/day-workout/day-workout-component.js'
import workoutsListComponent from './components/list/workouts/workouts-list-component.js'
import workoutFormComponent from './components/forms/workout/workout-form-component.js'
import workoutComponent from './components/pages/workout/workout-component.js'
import workoutExerciseFormComponent from './components/forms/workout-exercise/workout-exercise-form-component.js'
import calendarComponent from './components/dashboard/calendar/calendar-component.js'
import loadingComponent from './components/shared/loading/loading-component.js'
import configComponet from "./components/pages/config/config-component.js"
import locationsListComponet from "./components/list/locations/locations-list-component.js"
import locationFormComponet from "./components/forms/location/location-form-component.js"
import locationPageComponet from "./components/pages/location/location-page-component.js"

const { createApp } = Vue

const app = createApp({
    template: `#app-template`,
    data() {
        return {
            API_KEY: '',
            page: ''
        }
    },
    async mounted() {
        this.API_KEY = localStorage.API_KEY || ''
        this.changeRoute()
        window.onpopstate = () => {
            this.changeRoute()
        }
    },
    methods: {
        setApiKey(API_KEY) {
            this.API_KEY = API_KEY
        },
        changeRoute(page) {
            if (page) {
                history.pushState({}, "", `?${page}`)
            }
            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            this.page = params.page
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
        { tag: 'app-categorias-form', component: categoriasFormComponent, name: 'categorias-form', path: 'forms/categorias' },
        { tag: 'app-exercise-form', component: exerciseFormComponent, name: 'exercise-form', path: 'forms/exercise' },
        { tag: 'app-day-workout-form', component: dayWorkoutFormComponent, name: 'day-workout-form', path: 'forms/day-workout' },
        { tag: 'app-workout-form', component: workoutFormComponent, name: 'workout-form', path: 'forms/workout' },
        { tag: 'app-day-workout-list', component: dayWorkoutListComponent, name: 'days-workouts', path: 'list/days-workouts' },
        { tag: 'app-categorias-list', component: categoriasListComponent, name: 'categorias-list', path: 'list/categorias' },
        { tag: 'app-exercises-list', component: exercisesListComponent, name: 'exercises-list', path: 'list/exercises' },
        { tag: 'app-workouts-list', component: workoutsListComponent, name: 'workouts-list', path: 'list/workouts' },
        { tag: 'app-api-key-form', component: apiKeyFormComponent, name: 'api-key-form', path: 'forms/api-key' },
        { tag: 'app-workout-exercise-form', component: workoutExerciseFormComponent, name: 'workout-exercise-form', path: 'forms/workout-exercise' },
        { tag: 'app-categoria', component: categoriaComponent, name: 'categoria', path: 'pages/categoria' },
        { tag: 'app-exercise', component: exerciseComponent, name: 'exercise', path: 'pages/exercise' },
        { tag: 'app-workout', component: workoutComponent, name: 'workout', path: 'pages/workout' },
        { tag: 'app-day-workout', component: dayWorkoutComponent, name: 'day-workout', path: 'pages/day-workout' },
        { tag: 'app-calendar', component: calendarComponent, name: 'calendar', path: 'dashboard/calendar' },
        { tag: 'app-loading', component: loadingComponent, name: 'loading', path: 'shared/loading' },
        { tag: 'app-config', component: configComponet, name: 'config', path: 'pages/config' },
        { tag: 'app-locations-list', component: locationsListComponet, name: 'locations-list', path: 'list/locations' },
        { tag: 'app-location-form', component: locationFormComponet, name: 'location-form', path: 'forms/location' },
        { tag: 'app-location-page', component: locationPageComponet, name: 'location-page', path: 'pages/location' },
    ]

    for (let component of components) {
        await getTemplate(component.name, component.path)
        app.component(component.tag, component.component)
    }
    app.mount('#app')
}

getComponents()

window.addEventListener('load', ()=>{
    registerSW()
})

async function registerSW(){
    if('serviceWorker' in navigator){
        try{
            await navigator.serviceWorker.register('./sw.js')
        } catch(e){
            alert(`SW registration failed`);
        }
    }
}