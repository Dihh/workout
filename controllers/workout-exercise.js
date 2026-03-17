import { Controller } from "./controller.js"
import { uuidv4 } from '../main.js'
import { userCol, userDoc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where } from '../firestore.js'

export class WorkoutExerciseController extends Controller {

    async select() {
        const snap = await getDocs(userCol('workouts_exercises'))
        return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }

    async select_id(id) {
        const snap = await getDoc(userDoc('workouts_exercises', id))
        return snap.exists() ? { id: snap.id, ...snap.data() } : null
    }

    async select_by_workout(workout_id) {
        const snap = await getDocs(query(userCol('workouts_exercises'), where('workout_id', '==', workout_id)))
        return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }

    async insert(workoutExercise) {
        workoutExercise.id = uuidv4()
        await setDoc(userDoc('workouts_exercises', workoutExercise.id), workoutExercise)
        return workoutExercise.id
    }

    async update(workoutExercise) {
        await updateDoc(userDoc('workouts_exercises', workoutExercise.id), workoutExercise)
    }

    async delete(id) {
        await deleteDoc(userDoc('workouts_exercises', id))
    }
}
