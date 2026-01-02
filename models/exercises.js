import { database } from './index.js'

export const STORENAME = "exercises"

export const exerciseTable = {
    select: (transaction = database.db.transaction(STORENAME)) => {
        return new Promise((resolve) => {
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    select_id: (id, transaction = database.db.transaction(STORENAME)) => {
        return new Promise((resolve) => {
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.get(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    insert: (exercise) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME,"readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add({...exercise});
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: (exercise) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME,"readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put({...exercise});
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    delete: (id) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME,"readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.delete(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
}