import { Controller } from "./controller.js"

export class CategoryController extends Controller {

    constructor() {
        super()
    }

    async select() {
        return await this.store.category.select(this.store)
    }
    async select_id(id) {
        return await this.store.category.select_id(id, this.store)
    }
    async insert(category) {
        return await this.store.category.insert(category, this.store)
    }
    async update(category) {
        return await this.store.category.update(category, this.store)
    }
    async delete(id) {
        return await this.store.category.delete(id, this.store)
    }
}