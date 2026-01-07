export const STORENAME = "workouts_exercises"

export const workoutExerciseTable = {
    select: (store) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const objectStore = store.transaction.objectStore(STORENAME)
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                const workoutExercises = event.target.result
                const sortedWorkoutExercises = [...workoutExercises].sort((a,b) => a.id.localeCompare(b.id))
                resolve(sortedWorkoutExercises)
            }
        })
    },
    select_id: (store, id) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const objectStore = store.transaction.objectStore(STORENAME)
            const request = objectStore.get(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    insert: (store, workout_exercise) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add({ ...workout_exercise });
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: (store, workout_exercise) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put({ ...workout_exercise });
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    delete: (store, id) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.delete(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
}