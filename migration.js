import { db, userDoc } from './firestore.js'
import { getDocs, collection, writeBatch, doc } from './firestore.js'
import { auth } from './firebase.js'

const IDB_NAME = 'data'

// IndexedDB store name → Firestore collection name
const STORE_MAP = {
    categories:        'categories',
    exercises:         'exercises',
    workouts:          'workouts',
    workouts_exercises:'workouts_exercises',
    days_workouts:     'days_workouts',
    location:          'locations',
}

async function idbExists() {
    try {
        const dbs = await indexedDB.databases()
        return dbs.some(d => d.name === IDB_NAME)
    } catch {
        return false
    }
}

function openIDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(IDB_NAME)
        req.onsuccess = e => resolve(e.target.result)
        req.onerror = () => reject()
    })
}

function readStore(idb, storeName) {
    return new Promise(resolve => {
        try {
            const tx = idb.transaction(storeName, 'readonly')
            const req = tx.objectStore(storeName).getAll()
            req.onsuccess = e => resolve(e.target.result || [])
            req.onerror = () => resolve([])
        } catch {
            resolve([])
        }
    })
}

async function firestoreIsEmpty(uid) {
    const snap = await getDocs(collection(db, 'users', uid, 'categories'))
    return snap.empty
}

export async function migrateFromIndexedDB() {
    const uid = auth.currentUser?.uid
    if (!uid) return

    if (!(await firestoreIsEmpty(uid))) return
    if (!(await idbExists())) return

    let idb
    try {
        idb = await openIDB()
    } catch {
        return
    }

    const allData = {}
    for (const [idbStore, fsCol] of Object.entries(STORE_MAP)) {
        allData[fsCol] = await readStore(idb, idbStore)
    }
    idb.close()

    const records = Object.values(allData).flat()
    if (records.length === 0) return

    // Firestore batch supports up to 500 writes
    const BATCH_SIZE = 500
    let batch = writeBatch(db)
    let count = 0

    for (const [fsCol, items] of Object.entries(allData)) {
        for (const item of items) {
            if (!item.id) continue
            const ref = doc(db, 'users', uid, fsCol, item.id)
            batch.set(ref, item)
            count++
            if (count === BATCH_SIZE) {
                await batch.commit()
                batch = writeBatch(db)
                count = 0
            }
        }
    }

    if (count > 0) await batch.commit()

    console.log(`Migração concluída: ${records.length} registros importados do IndexedDB`)
}
