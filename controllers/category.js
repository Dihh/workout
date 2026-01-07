import { Controller } from "./controller.js"
import { uuidv4 } from '../main.js'

export class CategoryController extends Controller {

    constructor() {
        super()
    }

    async select() {
        return await this.store.category.select(this.store)
    }
    async select_id(id) {
        return await this.store.category.select_id(this.store, id)
    }
    async insert(category) {
        category.id = uuidv4()
        return await this.store.category.insert(this.store, category)
    }
    async update(category) {
        return await this.store.category.update(this.store, category)
    }
    async delete(id) {
        return await this.store.category.delete(this.store, id)
    }
}