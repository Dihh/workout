import { getParam } from '../../../main.js'
import { requests } from '../../../requests.js'

export default {
    template: `#exercise-form-template`,
    data() {
        return {
            loading: true,
            id: '',
            exercise: {},
            categories: []
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getData()
    },
    methods: {
        async createExercise() {
            this.loading = true
            const exercise = await requests.exercises.createExercise(this.exercise)
            location.href = `?page=exercise&id=${exercise.id}`
        },
        async updateExercise() {
            this.loading = true
            const exercise = await requests.exercises.updateExercise(this.id, this.exercise)
            location.href = `?page=exercise&id=${exercise.id}`
        },
        async getData() {
            const getExercisePromise = this.id ? requests.exercises.getExercise(this.id) : Promise.resolve({})
            const [exercises, categories] = await Promise.all([getExercisePromise, requests.categories.getCategories()])
            this.exercise = exercises
            this.categories = categories
            this.loading = false
        }
    }
}