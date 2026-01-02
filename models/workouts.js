import { database } from './index.js'
import { exerciseTable } from "./exercises.js"

export const STORENAME = "workouts"

export const workoutTable = {
    select: () => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME)
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    selectWorkoutExercises: (id) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(["workouts_exercises", "exercises"])
            const objectStore = transaction.objectStore("workouts_exercises")
            const index = objectStore.index("workout_id");
            const request = index.getAll(id);
            request.onsuccess = async (event) => {
                const data = await Promise.all(event.target.result.map(async workouts_exercise => {
                    const execise = await exerciseTable.select_id(workouts_exercise.exercise_id, transaction)
                    return {
                        ...workouts_exercise,
                        name: execise.name
                    }
                }))
                resolve(data)
            }
        })
    },
    select_id: (id) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME)
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.get(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    insert: (workout) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add({...workout});
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: (workout) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put({...workout});
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    delete: (id) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.delete(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
}