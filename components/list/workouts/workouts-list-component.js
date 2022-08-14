import { workoutTable } from "../../../models/workouts.js"

export default {
    template: `#workouts-list-template`,
    data() {
        return {
            workouts: [],
        }
    },
    mounted() {
        this.getWorkouts()
    },
    methods: {
        goTo(page, id) {
            let link = `?page=${page}`
            if (id) link += `&id=${id}`
            location.href = link
        },
        async getWorkouts() {
            this.workouts = await workoutTable.select()
        },
    }
}