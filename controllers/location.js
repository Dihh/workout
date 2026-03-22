import { Controller } from "./controller.js"
import { uuidv4 } from '../main.js'
import { userCol, userDoc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy } from '../firestore.js'

export class LocationController extends Controller {

    async select() {
        const snap = await getDocs(query(userCol('locations'), orderBy('name')))
        return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }

    async select_id(id) {
        const snap = await getDoc(userDoc('locations', id))
        return snap.exists() ? { id: snap.id, ...snap.data() } : null
    }

    async insert(location) {
        location.id = uuidv4()
        await setDoc(userDoc('locations', location.id), location)
        return location.id
    }

    async update(location) {
        await updateDoc(userDoc('locations', location.id), location)
    }


    async delete(id) {
        await deleteDoc(userDoc('locations', id))
    }
}
