import { getParam } from '../../../main.js'
import { dayWorkoutTable } from '../../../models/days-workouts.js'

export default {
    template: `#day-workout-template`,
    data() {
        return {
            dayWorkout: null,
            id: '',
            loading: true
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getDayWorkout(this.id)
    },
    methods: {
        async getDayWorkout() {
            this.dayWorkout = await dayWorkoutTable.select_id(this.id)
            this.loading = false
        },
        edit() {
            location.href = `?page=day-workout-form&id=${this.id}`
        },
        async remove() {
            this.loading = true
            await dayWorkoutTable.delete(this.id)
            location.href = `?page=days-workouts`
        },
    }
}