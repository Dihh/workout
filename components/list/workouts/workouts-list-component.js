import { workoutTable } from "../../../models/indexedDB/workouts.js"

export default {
    template: `#workouts-list-template`,
    emits: ['changeRoute'],
    data() {
        return {
            workouts: [],
            loading: true
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
            this.workouts = await workoutTable.select()
            this.loading = false
        },
    }
}