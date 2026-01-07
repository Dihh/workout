export const STORENAME = "exercises"

export const exerciseTable = {
    select: async (store) => {
        await store.connect()
        return new Promise((resolve) => {
            const objectStore = store.transaction.objectStore(STORENAME)
            const request = objectStore.openCursor();
            const execises = []
            request.onsuccess = async (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const execise = cursor.value
                    const category = await store.category.select_id(store, execise.category_id, store.transaction)
                    execises.push(
                        {
                            ...execise,
                            category_name: category ? category.name : ""
                        }
                    )
                    cursor.continue();
                } else {
                    const sortedExecises = [...execises].sort((a,b) => a.name.localeCompare(b.name))
                    resolve(sortedExecises)
                }
            }
        })
    },
    select_id: async (store, id, transaction = null) => {
        if(!transaction){
            await store.connect()
            transaction = store.transaction
        }
        return new Promise((resolve) => {
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.get(id);
            request.onsuccess = async (event) => {
                const execise = event.target.result
                if(execise){
                    const category = await store.category.select_id(store, execise.category_id, transaction)
                    resolve({
                        ...execise,
                        category_name: category.name
                    })
                }else{
                    resolve(undefined)
                }
            }
        })
    },
    insert: async (store, exercise) => {
        await store.connect()
        return new Promise((resolve) => {
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add({ ...exercise });
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: async (store, exercise) => {
        await store.connect()
        return new Promise((resolve) => {
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put({ ...exercise });
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    delete: async (store, id) => {
        await store.connect()
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