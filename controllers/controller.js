import { database } from '../models/indexedDB/index.js'

export class Controller{
    constructor(){
        this.store = database
        this.store.connect();
    }
}