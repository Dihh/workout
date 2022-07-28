import { getParam } from '../../../main.js'
import { requests } from '../../../requests.js'

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
            const workout = await requests.workouts.createWorkout(this.workout)
            location.href = `?page=workouts`
        },
        async updateWorkout() {
            this.loading = true
            const workout = await requests.workouts.updateWorkout(this.id, this.workout)
            location.href = `?page=workouts`
        },
        async getData() {
            const getWorkoutPromise = this.id ? requests.workouts.getWorkout(this.id) : Promise.resolve(this.workout)
            const [workout, categories, exercises] = await Promise.all([
                getWorkoutPromise,
                requests.categories.getCategories(),
                requests.exercises.getExercises()
            ])
            this.systemExercises = exercises
            this.categories = categories
            this.exercises = []
            this.category_id = workout.exercise?.category_id
            this.changeCategory()
            this.workout = workout
            this.loading = false
        },
        changeCategory() {
            this.exercises = this.systemExercises.filter(exercise => exercise.category_id == this.category_id)
        }
    }
}