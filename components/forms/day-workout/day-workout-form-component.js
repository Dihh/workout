import { getParam } from '../../../main.js'
import { CategoryController } from '../../../controllers/category.js'
import { ExerciseController } from '../../../controllers/exercise.js'
import { WorkoutController } from '../../../controllers/workout.js';
import { DayWorkoutsController } from '../../../controllers/day-workouts.js';
import { LocationController } from '../../../controllers/location.js';

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
            workout_id: null,
            categoryController: new CategoryController(),
            exerciseController: new ExerciseController(),
            workoutController: new WorkoutController(),
            dayWorkoutsController: new DayWorkoutsController(),
            locationController: new LocationController(),
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
            const lastWeight = await this.dayWorkoutsController.select_last_weight(this.dayWorkout.exercise_id)
            this.dayWorkout.weight = lastWeight?.weight || 0
        },
        async createDayByWorkouts() {
            this.loading = true
            const workoutExercises = await this.workoutController.selectWorkoutExercises(this.workout_id)
            await Promise.all(workoutExercises.map(async workoutExercise => {
                const lastWeight = await this.dayWorkoutsController.select_last_weight(workoutExercise.exercise_id)
                const dayWorkout = {
                    date: this.dayWorkout.date,
                    exercise_id: workoutExercise.exercise_id,
                    workout_id: this.workout_id,
                    weight: lastWeight?.weight || 0,
                    executed: 0
                }
                return this.dayWorkoutsController.insert(dayWorkout)
            }))
            const link = `page=days-workouts`
            this.$emit("changeRoute", link)
        },
        async createDayWorkout() {
            this.loading = true
            await this.dayWorkoutsController.insert({...this.dayWorkout})
            const link = `page=days-workouts`
            this.$emit("changeRoute", link)
        },
        async updateDayWorkout() {
            this.loading = true
            const { exercise_name, category_name, category_id, ...dayWorkout } = this.dayWorkout
            await this.dayWorkoutsController.update({...dayWorkout})
            const link = `page=days-workouts&date=${dayWorkout.date}`
            this.$emit("changeRoute", link)
        },
        async getData() {
            this.loading = true
            const getDayWorkoutPromise = this.id ? this.dayWorkoutsController.select_id(this.id) : Promise.resolve(this.dayWorkout)
            const dayWorkout = await getDayWorkoutPromise
            const [categories, exercises, workouts, locations] = await Promise.all([
                this.categoryController.select(),
                this.exerciseController.select(),
                this.workoutController.select(),
                this.locationController.select(),
            ])
            const locationMap = Object.fromEntries(locations.map(l => [l.id, l.name]))
            this.systemExercises = exercises
            this.categories = categories
            this.exercises = []
            this.category_id = dayWorkout.category_id
            this.changeCategory()
            this.dayWorkout = dayWorkout
            this.workouts = workouts.map(w => ({
                ...w,
                location_name: w.location_id ? locationMap[w.location_id] || null : null
            }))
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