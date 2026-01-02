import { database } from './index.js'
export const STORENAME = 'categories';

export const categoryTable = {
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
    select_id: (id, transaction = database.db.transaction(STORENAME)) => {
        return new Promise((resolve) => {
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.get(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    insert: (category) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME,"readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add({...category});
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: (category) => {
        return new Promise((resolve) => {
            const transaction = database.db.transaction(STORENAME,"readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put({...category});
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