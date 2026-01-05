import { database } from './index.js'
const STORENAME = "workouts_exercises"// import { db } from './index.js'

export const workoutExerciseTable = {
    select: () => {
        return new Promise(async (resolve) => {
            await database.connect()
            const transaction = database.db.transaction(STORENAME)
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    select_id: (id) => {
        return new Promise(async (resolve) => {
            await database.connect()
            const transaction = database.db.transaction(STORENAME)
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.get(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    insert: (workout_exercise) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add({ ...workout_exercise });
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: (workout_exercise) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put({ ...workout_exercise });
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