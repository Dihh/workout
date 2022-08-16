import { dayWorkoutTable } from '../../../models/days-workouts.js';

export default {
    template: `#days-workouts-template`,
    emits: ['changeRoute'],
    data() {
        return {
            systemDaysWorkouts: [],
            daysWorkouts: null,
            date: '',
            loading: true
        }
    },
    mounted() {
        const today = new Date()
        this.date = (new Date(
            Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
        )).toISOString().split("T")[0]
        this.getDaysWorkouts();
    },
    methods: {
        goTo(page, id) {
            let link = `page=${page}`
            if (id) link += `&id=${id}`
            this.$emit("changeRoute", link)
        },
        async getDaysWorkouts() {
            this.systemDaysWorkouts = await dayWorkoutTable.select()
            this.daysWorkouts = this.systemDaysWorkouts.filter(dayWorkout => dayWorkout.date == this.date)
            this.loading = false
        },
        changeDate(date) {
            this.date = date
            this.daysWorkouts = this.systemDaysWorkouts.filter(dayWorkout => dayWorkout.date == this.date)
        },
        weightUp(dayWorkout) {
            dayWorkout.weight++
            dayWorkoutTable.update(dayWorkout)
        },
        weightDown(dayWorkout) {
            dayWorkout.weight--
            dayWorkoutTable.update(dayWorkout)
        },
        update(dayWorkout) {
            dayWorkout.executed = !dayWorkout.executed ? 1 : 0
            dayWorkoutTable.update(dayWorkout)
        }
    }
}