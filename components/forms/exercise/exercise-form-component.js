import { getParam, uuidv4 } from '../../../main.js'
import { categoryTable } from '../../../models/categories.js'
import { exerciseTable } from '../../../models/exercises.js'

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
            this.exercise.id = uuidv4()
            await exerciseTable.insert(this.exercise)
            location.href = `?page=exercise&id=${this.exercise.id}`
        },
        async updateExercise() {
            this.loading = true
            await exerciseTable.update(this.exercise)
            location.href = `?page=exercise&id=${this.id}`
        },
        async getData() {
            const getExercisePromise = this.id ? exerciseTable.select_id(this.id) : Promise.resolve({})
            const [exercises, categories] = await Promise.all([getExercisePromise, categoryTable.select()])
            this.exercise = exercises
            this.categories = categories
            this.loading = false
        },
        submit() {
            event.preventDefault()
            if (this.id) {
                this.updateExercise()
            } else {
                this.createExercise()
            }
        }
    }
}