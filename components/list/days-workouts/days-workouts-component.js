import { DayWorkoutsController } from '../../../controllers/day-workouts.js';
import { LocationController } from '../../../controllers/location.js'
import { WorkoutController } from '../../../controllers/workout.js'
import { getParam } from '../../../main.js'

export default {
    template: `#days-workouts-template`,
    emits: ['changeRoute'],
    data() {
        return {
            systemDaysWorkouts: [],
            daysWorkouts: null,
            groupedDaysWorkouts: [],
            locationMap: {},
            workoutMap: {},
            date: '',
            loading: true,
            dayWorkoutsController: new DayWorkoutsController(),
            locationController: new LocationController(),
            workoutController: new WorkoutController(),
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
            const [daysWorkouts, locations, workouts] = await Promise.all([
                this.dayWorkoutsController.select(),
                this.locationController.select(),
                this.workoutController.select(),
            ])
            this.systemDaysWorkouts = daysWorkouts
            this.locationMap = Object.fromEntries(locations.map(l => [l.id, l.name]))
            this.workoutMap = Object.fromEntries(workouts.map(w => [w.id, w.name]))
            this.daysWorkouts = this.filterByDate(this.date)
            this.groupedDaysWorkouts = this.groupByWorkout(this.daysWorkouts)
            this.loading = false
        },
        changeDate(date) {
            this.date = date
            this.daysWorkouts = this.filterByDate(date)
            this.groupedDaysWorkouts = this.groupByWorkout(this.daysWorkouts)
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
        groupByWorkout(items) {
            const map = new Map()
            for (const dw of items) {
                const key = dw.workout_id || null
                if (!map.has(key)) map.set(key, [])
                map.get(key).push(dw)
            }
            return [...map.entries()].map(([workout_id, items]) => ({
                workout_id,
                workout_name: workout_id ? (this.workoutMap[workout_id] || 'Treino') : null,
                items,
            }))
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
            this.groupedDaysWorkouts = this.groupByWorkout(this.daysWorkouts)
        },
        async removeWorkoutGroup(workout_id) {
            if (!confirm('Remover todos os exercícios deste grupo?')) return
            const toRemove = this.daysWorkouts.filter(dw => (dw.workout_id || null) === workout_id)
            await Promise.all(toRemove.map(dw => this.dayWorkoutsController.delete(dw.id)))
            this.systemDaysWorkouts = this.systemDaysWorkouts.filter(dw => !toRemove.find(r => r.id === dw.id))
            this.daysWorkouts = this.filterByDate(this.date)
            this.groupedDaysWorkouts = this.groupByWorkout(this.daysWorkouts)
        },
    }
}