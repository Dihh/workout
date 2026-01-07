import { database } from './index.js'
import { exerciseTable } from "./exercises.js"
import { categoryTable } from "./categories.js"

export const STORENAME = "days_workouts"

export const dayWorkoutTable = {
    select: () => {
        return new Promise(async (resolve) => {
            await database.connect()
            const transaction = database.db.transaction([STORENAME, 'exercises', 'categories'])
            const objectStore = transaction.objectStore(STORENAME)
            const dayWorkouts = []
            const request = objectStore.openCursor();
            request.onsuccess = async (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const execise = await exerciseTable.select_id(database, cursor.value.exercise_id, transaction)
                    const category = await categoryTable.select_id(database, execise.category_id, transaction)
                    dayWorkouts.push({
                        ...cursor.value,
                        exercise_name: execise.name,
                        category_name: category.name
                    })
                    cursor.continue();
                } else {
                    resolve(dayWorkouts)
                }
            }
        })
    },
    select_between_date: (exercise_id, final_date) => {
        return new Promise(async (resolve) => {
            await database.connect()
            const transaction = database.db.transaction(STORENAME)
            const objectStore = transaction.objectStore(STORENAME)
            const index = objectStore.index("date");
            const range = IDBKeyRange.bound(exercise_id, final_date, false, false);
            const request = index.getAll(range);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    select_last_weight: (exercise_id) => {
        return new Promise(async (resolve) => {
            await database.connect()
            const transaction = database.db.transaction(STORENAME)
            const objectStore = transaction.objectStore(STORENAME)
            const dateIndex = objectStore.index("date");
            const dateRequest = dateIndex.openCursor(undefined, "prev");
            dateRequest.onsuccess = function (event) {
                const dateCursor = event.target.result;
                let date = (new Date())
                if (dateCursor){
                    date = dateCursor.value.date
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
    insert: (workout) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add(workout);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: (workout) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put(workout);
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