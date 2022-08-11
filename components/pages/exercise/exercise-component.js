import { getParam } from '../../../main.js'
import { exerciseTable } from '../../../models/exercises.js'

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
            this.exercise = await exerciseTable.select_id(this.id)
            this.loading = false
        },
        edit() {
            location.href = `?page=exercise-form&id=${this.id}`
        },
        async remove() {
            this.loading = true
            await exerciseTable.delete(this.id)
            location.href = `?page=exercises`
        },
    }
}