import { getParam, uuidv4 } from '../../../main.js'
import { workoutExerciseTable } from '../../../models/indexedDB/workouts_exercises.js'
import { CategoryController } from '../../../controllers/category.js'
import { ExerciseController } from '../../../controllers/exercise.js'

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
        }
    },
    beforeMount() {
        this.workoutExercise.workout_id = getParam('id')
        this.getData()
    },
    methods: {
        async addWorkoutExercise() {
            this.loading = true
            this.workoutExercise.id = uuidv4()
            await workoutExerciseTable.insert(this.workoutExercise)
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