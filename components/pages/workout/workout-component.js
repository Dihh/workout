import { getParam } from '../../../main.js'
import { requests } from '../../../requests.js'

export default {
    template: `#workouts-template`,
    data() {
        return {
            workout: null,
            id: '',
            loading: true
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getWorkout(this.id)
    },
    methods: {
        async getWorkout() {
            this.workout = await requests.workouts.getWorkout(this.id)
            this.loading = false
        },
        edit() {
            location.href = `?page=workout-form&id=${this.id}`
        },
        async remove() {
            this.loading = true
            await requests.workouts.removeWorkout(this.id)
            location.href = `?page=workouts`
        },
    }
}