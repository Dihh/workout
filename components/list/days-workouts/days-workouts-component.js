import { DayWorkoutsController } from '../../../controllers/day-workouts.js';

export default {
    template: `#days-workouts-template`,
    emits: ['changeRoute'],
    data() {
        return {
            systemDaysWorkouts: [],
            daysWorkouts: null,
            date: '',
            loading: true,
            dayWorkoutsController: new DayWorkoutsController(),
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
            this.systemDaysWorkouts = await this.dayWorkoutsController.select()
            this.daysWorkouts = this.systemDaysWorkouts.filter(dayWorkout => dayWorkout.date == this.date)
            this.loading = false
        },
        changeDate(date) {
            this.date = date
            this.daysWorkouts = this.systemDaysWorkouts.filter(dayWorkout => dayWorkout.date == this.date)
        },
        weightUp(dayWorkout) {
            dayWorkout.weight++
            this.dayWorkoutsController.update({...dayWorkout})
        },
        weightDown(dayWorkout) {
            dayWorkout.weight--
            this.dayWorkoutsController.update({...dayWorkout})
        },
        update(dayWorkout) {
            dayWorkout.executed = !dayWorkout.executed ? 1 : 0
            this.dayWorkoutsController.update({...dayWorkout})
        }
    }
}