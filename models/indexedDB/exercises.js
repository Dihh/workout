import { database } from './index.js'
import { categoryTable } from "./categories.js"

export const STORENAME = "exercises"

export const exerciseTable = {
    select: (transaction = database.db.transaction([STORENAME, "categories"])) => {
        return new Promise((resolve) => {
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.openCursor();
            const execises = []
            request.onsuccess = async (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const execise = cursor.value
                    const category = await categoryTable.select_id(execise.category_id, transaction)
                    execises.push(
                        {
                            ...execise,
                            category_name: category.name
                        }
                    )
                    cursor.continue();
                } else {
                    resolve(execises)
                }
            }
        })
    },
    select_id: (id, transaction = database.db.transaction([STORENAME, "categories"])) => {
        return new Promise((resolve) => {
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.get(id);
            request.onsuccess = async (event) => {
                const execise = event.target.result
                const category = await categoryTable.select_id(execise.category_id, transaction)
                resolve({
                    ...execise,
                    category_name: category.name
                })
            }
        })
    },
    insert: (exercise) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add({ ...exercise });
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: (exercise) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put({ ...exercise });
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