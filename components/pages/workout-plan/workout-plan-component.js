import { getParam, uuidv4 } from '../../../main.js'
import { WorkoutController } from '../../../controllers/workout.js'
import { DayWorkoutsController } from '../../../controllers/day-workouts.js'

export default {
    template: `#workout-plan-template`,
    emits: ['changeRoute'],
    data() {
        const today = new Date()
        const yyyy = today.getFullYear()
        const mm = String(today.getMonth() + 1).padStart(2, '0')
        const dd = String(today.getDate()).padStart(2, '0')
        return {
            loading: false,
            saving: false,
            workoutId: '',
            workout: null,
            startDate: `${yyyy}-${mm}-${dd}`,
            selectedWeekdays: [],
            weekdays: [
                { value: 0, label: 'Dom' },
                { value: 1, label: 'Seg' },
                { value: 2, label: 'Ter' },
                { value: 3, label: 'Qua' },
                { value: 4, label: 'Qui' },
                { value: 5, label: 'Sex' },
                { value: 6, label: 'Sáb' },
            ],
            workoutController: new WorkoutController(),
            dayWorkoutsController: new DayWorkoutsController(),
        }
    },
    async beforeMount() {
        this.workoutId = getParam('id')
        this.workout = await this.workoutController.select_id(this.workoutId)
    },
    computed: {
        currentMonthEnd() {
            const d = new Date(this.startDate + 'T00:00:00Z')
            return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0))
        },
        plannedDates() {
            if (!this.selectedWeekdays.length || !this.startDate) return []
            const dates = []
            const end = this.currentMonthEnd
            const cur = new Date(this.startDate + 'T00:00:00Z')
            while (cur <= end) {
                if (this.selectedWeekdays.includes(cur.getUTCDay())) {
                    dates.push(cur.toISOString().split('T')[0])
                }
                cur.setUTCDate(cur.getUTCDate() + 1)
            }
            return dates
        },
    },
    methods: {
        toggleWeekday(value) {
            const idx = this.selectedWeekdays.indexOf(value)
            if (idx === -1) this.selectedWeekdays.push(value)
            else this.selectedWeekdays.splice(idx, 1)
        },
        async save() {
            if (!this.selectedWeekdays.length) return
            this.saving = true
            const planing_id = uuidv4()
            const workoutExercises = await this.workoutController.selectWorkoutExercises(this.workoutId)
            const inserts = []
            for (const date of this.plannedDates) {
                for (const we of workoutExercises) {
                    const lastWeight = await this.dayWorkoutsController.select_last_weight(we.exercise_id)
                    inserts.push(this.dayWorkoutsController.insert({
                        date,
                        exercise_id: we.exercise_id,
                        workout_id: this.workoutId,
                        planing_id,
                        weight: lastWeight?.weight || 0,
                        executed: 0,
                    }))
                }
            }
            await Promise.all(inserts)
            this.$emit('changeRoute', `page=days-workouts`)
        },
    }
}
