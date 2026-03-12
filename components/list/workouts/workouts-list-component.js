import { WorkoutController } from '../../../controllers/workout.js';
import { LocationController } from '../../../controllers/location.js'

export default {
    template: `#workouts-list-template`,
    emits: ['changeRoute'],
    data() {
        return {
            workouts: [],
            locationMap: {},
            loading: true,
            workoutController: new WorkoutController(),
            locationController: new LocationController(),
        }
    },
    mounted() {
        this.getWorkouts()
    },
    methods: {
        goTo(page, id) {
            let link = `page=${page}`
            if (id) link += `&id=${id}`
            this.$emit("changeRoute", link)
        },
        async getWorkouts() {
            this.workouts = await this.workoutController.select()
            const locations = await this.locationController.select()
            this.locationMap = Object.fromEntries(locations.map(l => [l.id, l.name]))
            this.loading = false
        },
    }
}