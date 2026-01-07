import { Controller } from "./controller.js"
import { uuidv4 } from '../../../main.js'

export class WorkoutController extends Controller {

    constructor() {
        super()
    }

    async select() {
        return await this.store.workout.select(this.store)
    }
    async select_id(id) {
        return await this.store.workout.select_id(this.store, id)
    }
    async selectWorkoutExercises(id) {
        return await this.store.workout.selectWorkoutExercises(this.store, id)
    }
    async insert(workout) {
        workout.id = uuidv4()
        return await this.store.workout.insert(this.store, workout)
    }
    async update(workout) {
        return await this.store.workout.update(this.store, workout)
    }
    async delete(id) {
        return await this.store.workout.delete(this.store, id)
    }
}