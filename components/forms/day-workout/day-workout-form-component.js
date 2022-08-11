import { getParam, uuidv4 } from '../../../main.js'
import { categoryTable } from '../../../models/categories.js'
import { exerciseTable } from '../../../models/exercises.js'
import { dayWorkoutTable } from '../../../models/days-workouts.js'

export default {
    template: `#day-workout-form-template`,
    data() {
        return {
            loading: true,
            id: '',
            dayWorkout: {
                date: ''
            },
            categories: [],
            systemExercises: [],
            exercises: [],
            category_id: null
        }
    },
    beforeMount() {
        this.id = getParam('id')
        const today = new Date()
        this.dayWorkout.date = (new Date(
            Date.UTC(today.getFullYear(), today.getMonth() + 1, today.getDate())
        )).toISOString().split("T")[0]
        this.getData()
    },
    methods: {
        async createDayWorkout() {
            this.loading = true
            this.dayWorkout.id = uuidv4()
            await dayWorkoutTable.insert(this.dayWorkout)
            location.href = `?page=days-workouts`
        },
        async updateDayWorkout() {
            this.loading = true
            await dayWorkoutTable.update(this.dayWorkout)
            location.href = `?page=days-workouts`
        },
        async getData() {
            const getDayWorkoutPromise = this.id ? dayWorkoutTable.select_id(this.id) : Promise.resolve(this.dayWorkout)
            const [dayWorkout, categories, exercises] = await Promise.all([
                getDayWorkoutPromise,
                categoryTable.select(),
                exerciseTable.select()
            ])
            this.systemExercises = exercises
            this.categories = categories
            this.exercises = []
            this.category_id = dayWorkout.category_id
            this.changeCategory()
            this.dayWorkout = dayWorkout
            this.loading = false
        },
        changeCategory() {
            this.exercises = this.systemExercises.filter(exercise => exercise.category_id == this.category_id)
        }
    }
}