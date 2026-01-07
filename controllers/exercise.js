import { Controller } from "./controller.js"
import { uuidv4 } from '../../../main.js'

export class ExerciseController extends Controller {

    constructor() {
        super()
    }

    async select() {
        return await this.store.exercise.select(this.store)
    }
    async select_id(id) {
        return await this.store.exercise.select_id(this.store, id)
    }
    async insert(exercise) {
        exercise.id = uuidv4()
        return await this.store.exercise.insert(this.store, exercise)
    }
    async update(exercise) {
        return await this.store.exercise.update(this.store, exercise)
    }
    async delete(id) {
        return await this.store.exercise.delete(this.store, id)
    }
}