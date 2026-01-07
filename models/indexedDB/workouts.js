export const STORENAME = "workouts"

export const workoutTable = {
    select: (store) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const objectStore = store.transaction.objectStore(STORENAME)
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                const workouts = event.target.result
                const sortedWorkouts = [...workouts].sort((a, b) => a.name.localeCompare(b.name))
                resolve(sortedWorkouts)
            }
        })
    },
    selectWorkoutExercises: (store, id) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const objectStore = store.transaction.objectStore("workouts_exercises")
            const index = objectStore.index("workout_id");
            const request = index.getAll(id);
            request.onsuccess = async (event) => {
                const data = await Promise.all(event.target.result.map(async workouts_exercise => {
                    const exercise = await store.exercise.select_id(store, workouts_exercise.exercise_id, store.transaction)
                    return {
                        ...workouts_exercise,
                        name: exercise.name
                    }
                }))
                const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name))
                resolve(sortedData)
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
    insert: (store, workout) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add({ ...workout });
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: (store, workout) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put({ ...workout });
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