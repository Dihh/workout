import { requests } from '../../../requests.js'

export default {
    template: `#workout-template`,
    data() {
        return {
            systemWorkouts: [],
            workouts: null,
            date: (new Date()).toISOString().split("T")[0]
        }
    },
    mounted() {
        this.getWorkouts();
    },
    methods: {
        goTo(page, id) {
            let link = `?page=${page}`
            if (id) link += `&id=${id}`
            location.href = link
        },
        async getWorkouts() {
            this.systemWorkouts = await requests.workouts.getWorkouts()
            this.workouts = this.systemWorkouts.filter(workout => workout.date == this.date)
        },
        changeDate(date) {
            this.date = date
            this.workouts = this.systemWorkouts.filter(workout => workout.date == this.date)
        }
    }
}