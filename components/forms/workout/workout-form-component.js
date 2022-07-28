import { getParam, uuidv4 } from '../../../main.js'
import { categoria_table } from '../../../models/categories.js'
import { exercise_table } from '../../../models/exercises.js'
import { workout_table } from '../../../models/workouts.js'

export default {
    template: `#workout-form-template`,
    data() {
        return {
            loading: true,
            id: '',
            workout: {
                date: (new Date).toISOString().split("T")[0]
            },
            categories: [],
            systemExercises: [],
            exercises: [],
            category_id: null
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getData()
    },
    methods: {
        async createWorkout() {
            this.loading = true
            this.workout.id = uuidv4()
            await workout_table.insert(this.workout)
            location.href = `?page=workouts`
        },
        async updateWorkout() {
            this.loading = true
            await workout_table.update(this.workout)
            location.href = `?page=workouts`
        },
        async getData() {
            const getWorkoutPromise = this.id ? workout_table.select_id(this.id) : Promise.resolve(this.workout)
            const [workout, categories, exercises] = await Promise.all([
                getWorkoutPromise,
                categoria_table.select(),
                exercise_table.select()
            ])
            this.systemExercises = exercises
            this.categories = categories
            this.exercises = []
            this.category_id = workout.category_id
            this.changeCategory()
            this.workout = workout
            this.loading = false
        },
        changeCategory() {
            this.exercises = this.systemExercises.filter(exercise => exercise.category_id == this.category_id)
        }
    }
}