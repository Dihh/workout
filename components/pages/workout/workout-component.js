import { getParam } from '../../../main.js'
import { WorkoutController } from '../../../controllers/workout.js';
import { WorkoutExerciseController } from '../../../controllers/workout-exercise.js'

export default {
    template: `#workout-template`,
    emits: ['changeRoute'],
    data() {
        return {
            workout: null,
            exercises: [],
            id: '',
            loading: true,
            workoutController: new WorkoutController(),
            workoutExerciseController: new WorkoutExerciseController(),
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getWorkout(this.id)
        this.getExercises(this.id)
    },
    methods: {
        async getWorkout() {
            this.workout = await this.workoutController.select_id(this.id)
            this.loading = false
        },
        async getExercises() {
            this.exercises = await this.workoutController.selectWorkoutExercises(this.id)
            this.loading = false
        },
        edit() {
            const link = `page=workout-form&id=${this.id}`
            this.$emit("changeRoute", link)
        },
        goTo(page, id) {
            let link = `page=${page}`
            if (id) link += `&id=${id}`
            this.$emit("changeRoute", link)
        },
        async remove() {
            this.loading = true
            await this.workoutController.delete(this.id)
            await Promise.all(this.exercises.map(exercise => {
                return this.workoutExerciseController.delete(exercise.id)
            }))
            const link = `page=workouts`
            this.$emit("changeRoute", link)
        },
        remove_exercise(id) {
            if (confirm("Confirmar?")) {
                this.exercises = this.exercises.filter(exercise => exercise.id != id)
                this.workoutExerciseController.delete(id)
            }
        }
    }
}