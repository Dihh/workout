import { getParam } from '../../../main.js'
import { workoutTable } from '../../../models/workouts.js'
import { workoutExerciseTable } from '../../../models/workouts_exercises.js'

export default {
    template: `#workout-template`,
    emits: ['changeRoute'],
    data() {
        return {
            workout: null,
            exercises: [],
            id: '',
            loading: true
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getWorkout(this.id)
        this.getExercises(this.id)
    },
    methods: {
        async getWorkout() {
            this.workout = await workoutTable.select_id(this.id)
            this.loading = false
        },
        async getExercises() {
            this.exercises = await workoutTable.selectWorkoutExercises(this.id)
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
            await workoutTable.delete(this.id)
            await Promise.all(this.exercises.map(exercise => {
                return workoutExerciseTable.delete(exercise.id)
            }))
            const link = `page=workouts`
            this.$emit("changeRoute", link)
        },
        remove_exercise(id) {
            if (confirm("Confirmar?")) {
                this.exercises = this.exercises.filter(exercise => exercise.id != id)
                workoutExerciseTable.delete(id)
            }
        }
    }
}