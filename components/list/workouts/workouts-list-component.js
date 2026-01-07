import { WorkoutController } from '../../../controllers/workout.js';

export default {
    template: `#workouts-list-template`,
    emits: ['changeRoute'],
    data() {
        return {
            workouts: [],
            loading: true,
            workoutController: new WorkoutController()
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
            this.loading = false
        },
    }
}