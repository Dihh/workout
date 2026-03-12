import { ExerciseController } from '../../../controllers/exercise.js';
import { LocationController } from '../../../controllers/location.js'

export default {
    template: `#exercises-list-template`,
    emits: ['changeRoute'],
    data() {
        return {
            exercises: null,
            locationMap: {},
            loading: true,
            exerciseController: new ExerciseController(),
            locationController: new LocationController(),
        }
    },
    mounted() {
        this.getExercises();
    },
    methods: {
        goTo(page, id) {
            let link = `page=${page}`
            if (id) link += `&id=${id}`
            this.$emit("changeRoute", link)
        },
        async getExercises() {
            this.exercises = await this.exerciseController.select()
            const locations = await this.locationController.select()
            this.locationMap = Object.fromEntries(locations.map(l => [l.id, l.name]))
            this.loading = false
        },
    }
}