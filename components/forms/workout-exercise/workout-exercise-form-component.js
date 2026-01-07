import { getParam } from '../../../main.js'
import { CategoryController } from '../../../controllers/category.js'
import { ExerciseController } from '../../../controllers/exercise.js'
import { WorkoutExerciseController } from '../../../controllers/workout-exercise.js'

export default {
    template: `#workout-exercise-form-template`,
    data() {
        return {
            loading: true,
            categoryId: '',
            workoutExercise: {
                id: '',
                workout_id: '',
                exercise_id: '',
            },
            categories: [],
            systemExercises: [],
            exercises: [],
            categoryController: new CategoryController(),
            exerciseController: new ExerciseController(),
            workoutExerciseController: new WorkoutExerciseController(),
        }
    },
    beforeMount() {
        this.workoutExercise.workout_id = getParam('id')
        this.getData()
    },
    methods: {
        async addWorkoutExercise() {
            this.loading = true
            await this.workoutExerciseController.insert(this.workoutExercise)
            const link = `page=workout&id=${this.workoutExercise.workout_id}`
            this.$emit("changeRoute", link)
        },
        async getData() {
            const [categories, exercises] = await Promise.all([
                this.categoryController.select(),
                this.exerciseController.select()
            ])
            this.systemExercises = exercises
            this.categories = categories
            this.exercises = []
            this.loading = false
        },
        changeCategory() {
            this.exercises = this.systemExercises.filter(exercise => exercise.category_id == this.categoryId)
        },
        submit() {
            event.preventDefault()
            this.addWorkoutExercise()
        }
    }
}