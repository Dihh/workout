import { getParam } from '../../../main.js'
import { DayWorkoutsController } from '../../../controllers/day-workouts.js';

export default {
    template: `#day-workout-template`,
    data() {
        return {
            dayWorkout: null,
            id: '',
            loading: true,
            dayWorkoutsController: new DayWorkoutsController(),
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getDayWorkout(this.id)
    },
    methods: {
        async getDayWorkout() {
            this.dayWorkout = await this.dayWorkoutsController.select_id(this.id)
            this.loading = false
        },
        edit() {
            const link = `page=day-workout-form&id=${this.id}&form=exercise`
            this.$emit("changeRoute", link)
        },
        async remove() {
            if (!confirm('Deseja excluir este registro?')) return
            this.loading = true
            await this.dayWorkoutsController.delete(this.id)
            this.$emit("changeRoute", `page=days-workouts`)
        },
    }
}