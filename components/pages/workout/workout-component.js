import { getParam } from '../../../main.js'
import { workout_table } from '../../../models/workouts.js'

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
            this.workout = await workout_table.select_id(this.id)
            this.loading = false
        },
        edit() {
            location.href = `?page=workout-form&id=${this.id}`
        },
        async remove() {
            this.loading = true
            await workout_table.delete(this.id)
            location.href = `?page=workouts`
        },
    }
}