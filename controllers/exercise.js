import { Controller } from "./controller.js"
import { uuidv4 } from '../main.js'
import { userCol, userDoc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy } from '../firestore.js'

export class ExerciseController extends Controller {

    async select() {
        const [exerciseSnap, categorySnap] = await Promise.all([
            getDocs(query(userCol('exercises'), orderBy('name'))),
            getDocs(userCol('categories'))
        ])
        const categories = Object.fromEntries(categorySnap.docs.map(d => [d.id, d.data().name]))
        return exerciseSnap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            category_name: categories[d.data().category_id] || ''
        }))
    }

    async select_id(id) {
        const snap = await getDoc(userDoc('exercises', id))
        if (!snap.exists()) return null
        const exercise = { id: snap.id, ...snap.data() }
        if (exercise.category_id) {
            const catSnap = await getDoc(userDoc('categories', exercise.category_id))
            exercise.category_name = catSnap.exists() ? catSnap.data().name : ''
        }
        return exercise
    }

    async select_by_category(category_id) {
        const snap = await getDocs(query(userCol('exercises'), where('category_id', '==', category_id)))
        return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }

    async insert(exercise) {
        exercise.id = uuidv4()
        await setDoc(userDoc('exercises', exercise.id), exercise)
        return exercise.id
    }

    async update(exercise) {
        await updateDoc(userDoc('exercises', exercise.id), exercise)
    }

    async delete(id) {
        await deleteDoc(userDoc('exercises', id))
    }
}
