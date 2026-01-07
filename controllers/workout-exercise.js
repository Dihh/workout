import { Controller } from "./controller.js"
import { uuidv4 } from '../../../main.js'

export class WorkoutExerciseController extends Controller {

    constructor() {
        super()
    }

    async select() {
        return await this.store.workoutExercise.select(this.store)
    }
    async select_id(id) {
        return await this.store.workoutExercise.select_id(this.store, id)
    }
    async insert(workoutExercise) {
        workoutExercise.id = uuidv4()
        return await this.store.workoutExercise.insert(this.store, workoutExercise)
    }
    async update(workoutExercise) {
        return await this.store.workoutExercise.update(this.store, workoutExercise)
    }
    async delete(id) {
        return await this.store.workoutExercise.delete(this.store, id)
    }
}