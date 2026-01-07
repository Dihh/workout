import { Controller } from "./controller.js"
import { uuidv4 } from '../main.js'

export class DayWorkoutsController extends Controller {

    constructor() {
        super()
    }

    async select() {
        return await this.store.dayWorkout.select(this.store)
    }
    async select_id(id) {
        return await this.store.dayWorkout.select_id(this.store, id)
    }
    async select_between_date(exercise_id, final_date){
        return await this.store.dayWorkout.select_between_date(this.store, exercise_id, final_date)
    }
    async select_last_weight(exercise_id){
        return await this.store.dayWorkout.select_last_weight(this.store, exercise_id)
    }
    async insert(dayWorkout) {
        dayWorkout.id = uuidv4()
        return await this.store.dayWorkout.insert(this.store, dayWorkout)
    }
    async update(dayWorkout) {
        return await this.store.dayWorkout.update(this.store, dayWorkout)
    }
    async delete(id) {
        return await this.store.dayWorkout.delete(this.store, id)
    }
}