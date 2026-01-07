import { getParam } from '../../../main.js'
import { ExerciseController } from '../../../controllers/exercise.js'

export default {
    template: `#exercises-template`,
    data() {
        return {
            exercise: null,
            id: '',
            loading: true,
            exerciseController: new ExerciseController()
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getExercise(this.id)
    },
    methods: {
        async getExercise() {
            this.exercise = await this.exerciseController.select_id(this.id)
            this.loading = false
        },
        edit() {
            const link = `page=exercise-form&id=${this.id}`
            this.$emit("changeRoute", link)
        },
        async remove() {
            this.loading = true
            await this.exerciseController.delete(this.id)
            const link = `page=exercises`
            this.$emit("changeRoute", link)
        },
    }
}