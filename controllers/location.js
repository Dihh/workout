import { Controller } from "./controller.js"
import { uuidv4 } from '../main.js'

export class LocationController extends Controller {

    constructor() {
        super()
    }

    async select() {
        return [{name: "local", id: "123"}]//await this.store.location.select(this.store)
    }
    async select_id(id) {
        return {name: "local", id: "123"}//await this.store.location.select_id(this.store, id)
    }
    async insert(location) {
        location.id = uuidv4()
        return "123"//await this.store.location.insert(this.store, location)
    }
    async update(location) {
        return await "123"//this.store.location.update(this.store, location)
    }
    async delete(id) {
        return //await this.store.location.delete(this.store, id)
    }
}