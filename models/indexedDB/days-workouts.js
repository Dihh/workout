export const STORENAME = "days_workouts"

export const dayWorkoutTable = {
    select: (store) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction([STORENAME, 'exercises', 'categories'])
            const objectStore = transaction.objectStore(STORENAME)
            const dayWorkouts = []
            const request = objectStore.openCursor();
            request.onsuccess = async (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const exercise = await store.exercise.select_id(store, cursor.value.exercise_id, transaction)
                    const category = await store.category.select_id(store, exercise.category_id, transaction)
                    dayWorkouts.push({
                        ...cursor.value,
                        exercise_name: exercise.name,
                        category_name: category.name
                    })
                    cursor.continue();
                } else {
                    const filteredDayWorkouts = [...dayWorkouts].sort((a, b) => a.exercise_name.localeCompare(b.exercise_name))
                    resolve(filteredDayWorkouts)
                }
            }
        })
    },
    select_between_date: (store, initial_date, final_date) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME)
            const objectStore = transaction.objectStore(STORENAME)
            const index = objectStore.index("date");
            const range = IDBKeyRange.bound(initial_date, final_date, false, false);
            const request = index.getAll(range);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    select_last_weight: (store, exercise_id) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME)
            const objectStore = transaction.objectStore(STORENAME)
            const dateIndex = objectStore.index("exercise_id");
            const range = IDBKeyRange.only(exercise_id);
            const dateRequest = dateIndex.getAll(range);
            dateRequest.onsuccess = function (event) {
                const dateCursor = event.target.result;
                let date = (new Date())
                if (dateCursor.length){
                    date = dateCursor.sort((a, b) => a.date.localeCompare(b.date))[0].date
                }
                const index = objectStore.index("date-exercise_id");
                const request = index.openCursor([date, exercise_id], "prev");
                request.onsuccess = function (event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        resolve(cursor.value)
                    } else {
                        resolve(0)
                    }

                }
            }
        })
    },
    select_id: (store, id) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME)
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.get(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    insert: (store, workout) => {
        return new Promise((resolve) => {
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add(workout);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: (store, workout) => {
        return new Promise((resolve) => {
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put(workout);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    delete: (store, id) => {
        return new Promise((resolve) => {
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.delete(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
}