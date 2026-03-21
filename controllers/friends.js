import { auth } from '../firebase.js'
import { db, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from '../firestore.js'
import { uuidv4 } from '../main.js'

export class FriendsController {

    get uid() {
        return auth.currentUser?.uid
    }

    async _findUserByEmail(email) {
        const snap = await getDocs(query(collection(db, 'users'), where('email', '==', email)))
        if (snap.empty) return null
        const d = snap.docs[0]
        return { uid: d.id, ...d.data() }
    }

    async sendRequest(toEmail) {
        const me = auth.currentUser
        if (!me) throw new Error('Não autenticado')
        if (toEmail === me.email) throw new Error('Você não pode adicionar a si mesmo')

        const target = await this._findUserByEmail(toEmail)
        if (!target) throw new Error('Usuário não encontrado')

        // check if request already exists
        const existing = await getDocs(query(
            collection(db, 'friend_requests'),
            where('from_uid', '==', me.uid),
            where('to_uid', '==', target.uid)
        ))
        if (!existing.empty) throw new Error('Solicitação já enviada')

        const id = uuidv4()
        await setDoc(doc(db, 'friend_requests', id), {
            from_uid: me.uid,
            from_name: me.displayName || '',
            from_email: me.email || '',
            to_uid: target.uid,
            to_name: target.name || '',
            to_email: target.email || '',
            status: 'pending',
        })
    }

    async getPendingSent() {
        const snap = await getDocs(query(
            collection(db, 'friend_requests'),
            where('from_uid', '==', this.uid),
            where('status', '==', 'pending')
        ))
        return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }

    async getPendingReceived() {
        const snap = await getDocs(query(
            collection(db, 'friend_requests'),
            where('to_uid', '==', this.uid),
            where('status', '==', 'pending')
        ))
        return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }

    async getFriends() {
        const [sentSnap, receivedSnap] = await Promise.all([
            getDocs(query(collection(db, 'friend_requests'), where('from_uid', '==', this.uid), where('status', '==', 'accepted'))),
            getDocs(query(collection(db, 'friend_requests'), where('to_uid', '==', this.uid), where('status', '==', 'accepted'))),
        ])
        const fromSent = sentSnap.docs.map(d => ({ id: d.id, name: d.data().to_name, email: d.data().to_email }))
        const fromReceived = receivedSnap.docs.map(d => ({ id: d.id, name: d.data().from_name, email: d.data().from_email }))
        return [...fromSent, ...fromReceived]
    }

    async getRequest(id) {
        const snap = await getDoc(doc(db, 'friend_requests', id))
        return snap.exists() ? { id: snap.id, ...snap.data() } : null
    }

    async acceptRequest(id) {
        await updateDoc(doc(db, 'friend_requests', id), { status: 'accepted' })
    }

    async rejectRequest(id) {
        await deleteDoc(doc(db, 'friend_requests', id))
    }

    async removeFriend(id) {
        await deleteDoc(doc(db, 'friend_requests', id))
    }
}
