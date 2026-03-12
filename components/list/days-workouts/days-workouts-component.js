import { DayWorkoutsController } from '../../../controllers/day-workouts.js';
import { LocationController } from '../../../controllers/location.js'
import { getParam } from '../../../main.js'

export default {
    template: `#days-workouts-template`,
    emits: ['changeRoute'],
    data() {
        return {
            systemDaysWorkouts: [],
            daysWorkouts: null,
            locationMap: {},
            date: '',
            loading: true,
            dayWorkoutsController: new DayWorkoutsController(),
            locationController: new LocationController(),
        }
    },
    mounted() {
        const paramDate = getParam('date')
        if (paramDate) {
            this.date = paramDate
        } else {
            const today = new Date()
            this.date = (new Date(
                Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
            )).toISOString().split("T")[0]
        }
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
            const locations = await this.locationController.select()
            this.locationMap = Object.fromEntries(locations.map(l => [l.id, l.name]))
            this.daysWorkouts = this.filterByDate(this.date)
            this.loading = false
        },
        changeDate(date) {
            this.date = date
            this.daysWorkouts = this.filterByDate(date)
        },
        filterByDate(date) {
            return this.systemDaysWorkouts
                .filter(dw => dw.date == date)
                .map(dw => {
                    const history = this.systemDaysWorkouts.filter(h => h.exercise_id == dw.exercise_id)
                    const weights = history.map(h => Number(h.weight))
                    const lastRecord = history.sort((a, b) => b.date.localeCompare(a.date))[0]
                    return {
                        ...dw,
                        lastWeight: lastRecord ? lastRecord.weight : null,
                        maxWeight: weights.length ? Math.max(...weights) : null,
                    }
                })
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
        },
        markAllExecuted() {
            this.daysWorkouts.forEach(dayWorkout => {
                dayWorkout.executed = 1
                this.dayWorkoutsController.update({...dayWorkout})
            })
        },
        async removeUnexecuted() {
            if (!confirm('Remover todos os exercícios não executados?')) return
            const unexecuted = this.daysWorkouts.filter(dw => !dw.executed)
            await Promise.all(unexecuted.map(dw => this.dayWorkoutsController.delete(dw.id)))
            this.systemDaysWorkouts = this.systemDaysWorkouts.filter(dw => !unexecuted.find(u => u.id === dw.id))
            this.daysWorkouts = this.filterByDate(this.date)
        }
    }
}