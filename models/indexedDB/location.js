export const STORENAME = 'location';

export const locationTable = {
    select: async (store) => {
        return new Promise(async (resolve, reject) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME)
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                const locations = event.target.result
                const sortedlocations = [...locations].sort((a, b) => a.name.localeCompare(b.name))
                resolve(sortedlocations)
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
    insert: async (store, location) => {
        return new Promise(async (resolve, reject) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add({ ...location });
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: async (store, location) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put({ ...location });
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