import { getParam } from '../../../main.js'
import { requests } from '../../../requests.js'

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
            this.exercise = await requests.exercises.getExercise(this.id)
            this.loading = false
        },
        edit() {
            location.href = `?page=exercise-form&id=${this.id}`
        },
        async remove() {
            this.loading = true
            await requests.exercises.removeExercise(this.id)
            location.href = `?page=exercises`
        },
    }
}