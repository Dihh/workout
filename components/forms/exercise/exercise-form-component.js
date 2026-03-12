import { getParam } from '../../../main.js'
import { CategoryController } from '../../../controllers/category.js'
import { ExerciseController } from '../../../controllers/exercise.js'
import { LocationController } from '../../../controllers/location.js'

export default {
    template: `#exercise-form-template`,
    data() {
        return {
            loading: true,
            id: '',
            exercise: {},
            categories: [],
            locations: [],
            categoryController: new CategoryController(),
            exerciseController: new ExerciseController(),
            locationController: new LocationController(),
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
            this.exercise = this.id ? await this.exerciseController.select_id(this.id) : {}
            this.categories = await this.categoryController.select()
            this.locations = await this.locationController.select()
            this.loading = false
        },
        onPhotoChange(event) {
            const file = event.target.files[0]
            if (!file) return
            const reader = new FileReader()
            reader.onload = e => { this.exercise.photo = e.target.result }
            reader.readAsDataURL(file)
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