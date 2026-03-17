import { Controller } from "./controller.js"
import { uuidv4 } from '../main.js'
import { userCol, userDoc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy } from '../firestore.js'

export class WorkoutController extends Controller {

    async select() {
        const snap = await getDocs(query(userCol('workouts'), orderBy('name')))
        return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }

    async select_id(id) {
        const snap = await getDoc(userDoc('workouts', id))
        return snap.exists() ? { id: snap.id, ...snap.data() } : null
    }

    async selectWorkoutExercises(id) {
        const weSnap = await getDocs(query(userCol('workouts_exercises'), where('workout_id', '==', id)))
        const workoutExercises = weSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        if (workoutExercises.length === 0) return []
        const exerciseIds = [...new Set(workoutExercises.map(we => we.exercise_id))]
        const exercises = await Promise.all(exerciseIds.map(eid => getDoc(userDoc('exercises', eid))))
        const exerciseMap = Object.fromEntries(exercises.map(s => [s.id, s.exists() ? s.data() : {}]))
        return workoutExercises.map(we => ({
            ...we,
            exercise_name: exerciseMap[we.exercise_id]?.name || ''
        }))
    }

    async insert(workout) {
        workout.id = uuidv4()
        await setDoc(userDoc('workouts', workout.id), workout)
        return workout.id
    }

    async update(workout) {
        await updateDoc(userDoc('workouts', workout.id), workout)
    }

    async delete(id) {
        await deleteDoc(userDoc('workouts', id))
    }
}
