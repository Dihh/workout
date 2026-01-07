export const STORENAME = 'categories';

export const categoryTable = {
    select: async (store) => {
        return new Promise(async (resolve, reject) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME)
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                const categories = event.target.result
                const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name))
                resolve(sortedCategories)
            }
        })
    },
    select_id: async (store, id, transaction = null) => {
        return new Promise(async (resolve) => {
            if(!transaction){
                await store.connect()
                transaction = store.transaction
            }
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.get(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    insert: async (store, category) => {
        return new Promise(async (resolve, reject) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add({ ...category });
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: async (store, category) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put({ ...category });
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    delete: async (store, id) => {
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