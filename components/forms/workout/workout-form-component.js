import { getParam } from '../../../main.js'
import { WorkoutController } from '../../../controllers/workout.js';
import { LocationController } from '../../../controllers/location.js'

export default {
    template: `#workout-form-template`,
    data() {
        return {
            loading: true,
            id: '',
            workout: {},
            locations: [],
            workoutController: new WorkoutController(),
            locationController: new LocationController(),
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getData()
    },
    methods: {
        async createWorkout() {
            this.loading = true
            await this.workoutController.insert(this.workout)
            const link = `page=workout&id=${this.workout.id}`
            this.$emit("changeRoute", link)
        },
        async updateWorkout() {
            this.loading = true
            await this.workoutController.update(this.workout)
            const link = `page=workout&id=${this.id}`
            this.$emit("changeRoute", link)
        },
        async getData() {
            this.workout = this.id ? await this.workoutController.select_id(this.id) : {}
            this.locations = await this.locationController.select()
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