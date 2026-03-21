import {
    initializeFirestore,
    persistentLocalCache,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js"
import { firebaseApp, auth } from './firebase.js'

export const db = initializeFirestore(firebaseApp, {
    localCache: persistentLocalCache()
})

export function userCol(name) {
    const uid = auth.currentUser?.uid
    if (!uid) throw new Error('Usuário não autenticado')
    return collection(db, 'users', uid, name)
}

export function userDoc(colName, id) {
    const uid = auth.currentUser?.uid
    if (!uid) throw new Error('Usuário não autenticado')
    return doc(db, 'users', uid, colName, id)
}

export async function saveUserProfile(user) {
    const userRef = doc(db, 'users', user.uid)
    await setDoc(userRef, {
        name: user.displayName || '',
        email: user.email || '',
    }, { merge: true })
}

export { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, writeBatch }
