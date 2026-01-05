export const STORENAME = 'categories';

export const categoryTable = {
    select: (store) => {
        return new Promise(async (resolve, reject) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME)
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.getAll();
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    select_id: (id, store, transaction = null) => {
        return new Promise(async (resolve) => {
            await store.connect()
            if(transaction == null){
                transaction = store.db.transaction(STORENAME)
            }
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.get(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    insert: (category, store) => {
        return new Promise(async (resolve, reject) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME,"readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add({...category});
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: (category, store) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME,"readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put({...category});
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    delete: (id, store) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME,"readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.delete(id);
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
}