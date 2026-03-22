import { Controller } from "./controller.js"
import { uuidv4 } from '../main.js'
import { userCol, userDoc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy } from '../firestore.js'

export class DayWorkoutsController extends Controller {

    async select() {
        const snap = await getDocs(query(userCol('days_workouts'), orderBy('date', 'desc')))
        return this._joinExercises(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }

    async select_id(id) {
        const snap = await getDoc(userDoc('days_workouts', id))
        if (!snap.exists()) return null
        const [joined] = await this._joinExercises([{ id: snap.id, ...snap.data() }])
        return joined
    }

    async select_between_date(initial_date, final_date) {
        const snap = await getDocs(query(
            userCol('days_workouts'),
            where('date', '>=', initial_date),
            where('date', '<=', final_date)
        ))
        return this._joinExercises(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }

    async select_by_exercise(exercise_id) {
        const snap = await getDocs(query(
            userCol('days_workouts'),
            where('exercise_id', '==', exercise_id),
            orderBy('date', 'asc')
        ))
        return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }

    async select_by_planing(planing_id) {
        const snap = await getDocs(query(
            userCol('days_workouts'),
            where('planing_id', '==', planing_id)
        ))
        return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }

    async select_last_weight(exercise_id) {
        const records = await this.select_by_exercise(exercise_id)
        if (records.length === 0) return null
        return records[records.length - 1]
    }

    async insert(dayWorkout) {
        dayWorkout.id = uuidv4()
        await setDoc(userDoc('days_workouts', dayWorkout.id), dayWorkout)
        return dayWorkout.id
    }

    async update(dayWorkout) {
        await updateDoc(userDoc('days_workouts', dayWorkout.id), dayWorkout)
    }

    async delete(id) {
        await deleteDoc(userDoc('days_workouts', id))
    }

    async _joinExercises(dayWorkouts) {
        if (dayWorkouts.length === 0) return []
        const exerciseIds = [...new Set(dayWorkouts.map(dw => dw.exercise_id))]
        const exercises = await Promise.all(exerciseIds.map(id => getDoc(userDoc('exercises', id))))
        const exerciseMap = Object.fromEntries(exercises.map(s => [s.id, s.exists() ? s.data() : {}]))
        const categoryIds = [...new Set(Object.values(exerciseMap).map(e => e.category_id).filter(Boolean))]
        const categories = await Promise.all(categoryIds.map(id => getDoc(userDoc('categories', id))))
        const categoryMap = Object.fromEntries(categories.map(s => [s.id, s.exists() ? s.data() : {}]))
        return dayWorkouts.map(dw => {
            const exercise = exerciseMap[dw.exercise_id] || {}
            const category = categoryMap[exercise.category_id] || {}
            return {
                ...dw,
                exercise_name: exercise.name || '',
                category_name: category.name || '',
                category_id: exercise.category_id || ''
            }
        })
    }
}
