import { Controller } from "./controller.js"
import { uuidv4 } from '../main.js'
import { userCol, userDoc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, orderBy } from '../firestore.js'

export class CategoryController extends Controller {

    async select() {
        const snap = await getDocs(query(userCol('categories'), orderBy('name')))
        return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }

    async select_id(id) {
        const snap = await getDoc(userDoc('categories', id))
        return snap.exists() ? { id: snap.id, ...snap.data() } : null
    }

    async insert(category) {
        category.id = uuidv4()
        await setDoc(userDoc('categories', category.id), category)
        return category.id
    }

    async update(category) {
        await updateDoc(userDoc('categories', category.id), category)
    }

    async delete(id) {
        await deleteDoc(userDoc('categories', id))
    }
}
