export const STORENAME = "exercises"

export const exerciseTable = {
    select: (store) => {
        return new Promise(async (resolve) => {
            await store.connect()
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
    select_id: (store, id, transaction = null) => {
        return new Promise(async (resolve) => {
            if(!transaction){
                await store.connect()
                transaction = store.transaction
            }
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
    insert: (store, exercise) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.add({ ...exercise });
            request.onsuccess = (event) => {
                resolve(event.target.result)
            }
        })
    },
    update: (store, exercise) => {
        return new Promise(async (resolve) => {
            await store.connect()
            const transaction = store.db.transaction(STORENAME, "readwrite")
            const objectStore = transaction.objectStore(STORENAME)
            const request = objectStore.put({ ...exercise });
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