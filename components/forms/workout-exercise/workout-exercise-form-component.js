import { getParam, uuidv4 } from '../../../main.js'
import { categoryTable } from '../../../models/categories.js'
import { exerciseTable } from '../../../models/exercises.js'
import { workoutExerciseTable } from '../../../models/workouts_exercises.js'

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
            exercises: []
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
            location.href = `?page=workout&id=${this.workoutExercise.workout_id}`
        },
        async getData() {
            const [categories, exercises] = await Promise.all([
                categoryTable.select(),
                exerciseTable.select()
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