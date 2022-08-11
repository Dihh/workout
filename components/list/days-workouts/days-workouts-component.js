import { dayWorkoutTable } from '../../../models/days-workouts.js';

export default {
    template: `#days-workouts-template`,
    data() {
        return {
            systemDaysWorkouts: [],
            daysWorkouts: null,
            date: ''
        }
    },
    mounted() {
        const today = new Date()
        this.date = (new Date(
            Date.UTC(today.getFullYear(), today.getMonth() + 1, today.getDate())
        )).toISOString().split("T")[0]
        this.getDaysWorkouts();
    },
    methods: {
        goTo(page, id) {
            let link = `?page=${page}`
            if (id) link += `&id=${id}`
            location.href = link
        },
        async getDaysWorkouts() {
            this.systemDaysWorkouts = await dayWorkoutTable.select()
            this.daysWorkouts = this.systemDaysWorkouts.filter(dayWorkout => dayWorkout.date == this.date)
        },
        changeDate(date) {
            this.date = date
            this.dayWorkouts = this.systemDaysWorkouts.filter(dayWorkout => dayWorkout.date == this.date)
        }
    }
}