import { getParam } from '../../../main.js'
import { exercise_table } from '../../../models/exercises.js'

export default {
    template: `#exercises-template`,
    data() {
        return {
            exercise: null,
            id: '',
            loading: true
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getExercise(this.id)
    },
    methods: {
        async getExercise() {
            this.exercise = await exercise_table.select_id(this.id)
            this.loading = false
        },
        edit() {
            location.href = `?page=exercise-form&id=${this.id}`
        },
        async remove() {
            this.loading = true
            await exercise_table.delete(this.id)
            location.href = `?page=exercises`
        },
    }
}