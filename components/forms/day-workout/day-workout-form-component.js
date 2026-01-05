import { getParam, uuidv4 } from '../../../main.js'
import { categoryTable } from '../../../models/indexedDB/categories.js'
import { exerciseTable } from '../../../models/indexedDB/exercises.js'
import { dayWorkoutTable } from '../../../models/indexedDB/days-workouts.js'
import { workoutTable } from '../../../models/indexedDB/workouts.js'

export default {
    template: `#day-workout-form-template`,
    emits: ['changeRoute'],
    data() {
        return {
            loading: true,
            id: '',
            form: '',
            dayWorkout: {
                date: '',
                executed: 0
            },
            categories: [],
            systemExercises: [],
            exercises: [],
            workouts: [],
            category_id: null,
            workout_id: null
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.changeForm()
        const today = new Date()
        this.dayWorkout.date = (new Date(
            Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
        )).toISOString().split("T")[0]
        this.getData()
    },
    methods: {
        changeForm() {
            this.form = getParam('form') || 'workout'
        },
        async setLastWeight() {
            const lastWeight = await dayWorkoutTable.select_last_weight(this.dayWorkout.exercise_id)
            this.dayWorkout.weight = lastWeight?.weight || 0
        },
        async createDayByWorkouts() {
            this.loading = true
            const workoutExercises = await workoutTable.selectWorkoutExercises(this.workout_id)
            await Promise.all(workoutExercises.map(async workoutExercise => {
                const lastWeight = await dayWorkoutTable.select_last_weight(workoutExercise.exercise_id)
                const dayWorkout = {
                    id: uuidv4(),
                    date: this.dayWorkout.date,
                    exercise_id: workoutExercise.exercise_id,
                    weight: lastWeight?.weight || 0,
                    executed: 0
                }
                return dayWorkoutTable.insert(dayWorkout)
            }))
            const link = `page=days-workouts`
            this.$emit("changeRoute", link)
        },
        async createDayWorkout() {
            this.loading = true
            this.dayWorkout.id = uuidv4()
            await dayWorkoutTable.insert(this.dayWorkout)
            const link = `page=days-workouts`
            this.$emit("changeRoute", link)
        },
        async updateDayWorkout() {
            this.loading = true
            await dayWorkoutTable.update(this.dayWorkout)
            const link = `page=days-workouts`
            this.$emit("changeRoute", link)
        },
        async getData() {
            const getDayWorkoutPromise = this.id ? dayWorkoutTable.select_id(this.id) : Promise.resolve(this.dayWorkout)
            const [dayWorkout, categories, exercises, workouts] = await Promise.all([
                getDayWorkoutPromise,
                categoryTable.select(),
                exerciseTable.select(),
                workoutTable.select()
            ])
            this.systemExercises = exercises
            this.categories = categories
            this.exercises = []
            this.category_id = dayWorkout.category_id
            this.changeCategory()
            this.dayWorkout = dayWorkout
            this.workouts = workouts
            this.loading = false
        },
        changeCategory() {
            this.exercises = this.systemExercises.filter(exercise => exercise.category_id == this.category_id)
        },
        submit() {
            event.preventDefault()
            if (this.id) {
                this.updateDayWorkout()
            } else {
                this.createDayWorkout()
            }
        },
        goTo(link) {
            event.preventDefault()
            this.$emit("changeRoute", link)
            this.changeForm()
        }
    }
}