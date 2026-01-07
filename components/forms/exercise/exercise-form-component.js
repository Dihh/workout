import { getParam } from '../../../main.js'
import { CategoryController } from '../../../controllers/category.js'
import { ExerciseController } from '../../../controllers/exercise.js'

export default {
    template: `#exercise-form-template`,
    data() {
        return {
            loading: true,
            id: '',
            exercise: {},
            categories: [],
            categoryController: new CategoryController(),
            exerciseController: new ExerciseController(),
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getData()
    },
    methods: {
        async createExercise() {
            this.loading = true
            await this.exerciseController.insert(this.exercise)
            const link = `page=exercise&id=${this.exercise.id}`
            this.$emit("changeRoute", link)
        },
        async updateExercise() {
            this.loading = true
            await this.exerciseController.update(this.exercise)
            const link = `page=exercise&id=${this.id}`
            this.$emit("changeRoute", link)
        },
        async getData() {
            const getExercisePromise = this.id ? await this.exerciseController.select_id(this.id) : Promise.resolve({})
            const [exercises, categories] = await Promise.all([getExercisePromise, this.categoryController.select()])
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