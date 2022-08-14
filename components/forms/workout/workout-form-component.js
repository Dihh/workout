import { getParam, uuidv4 } from '../../../main.js'
import { workoutTable } from '../../../models/workouts.js'

export default {
    template: `#workout-form-template`,
    data() {
        return {
            loading: true,
            id: '',
            workout: {}
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
            await workoutTable.insert(this.workout)
            location.href = `?page=workout&id=${this.workout.id}`
        },
        async updateWorkout() {
            this.loading = true
            await workoutTable.update(this.workout)
            location.href = `?page=workout&id=${this.id}`
        },
        async getData() {
            const getWorkoutPromise = this.id ? workoutTable.select_id(this.id) : Promise.resolve({})
            const [workout] = await Promise.all([getWorkoutPromise])
            this.workout = workout
            this.loading = false
        },
        submit() {
            event.preventDefault()
            if (this.id) {
                this.updateWorkout()
            } else {
                this.createWorkout()
            }
        }
    }
}