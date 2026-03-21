import { FriendsController } from '../../../controllers/friends.js'

export default {
    template: `#friends-template`,
    emits: ['changeRoute'],
    data() {
        return {
            loading: true,
            friendsController: new FriendsController(),
            friends: [],
            pendingRequests: [],
            pendingSent: [],
            friendEmail: '',
            sending: false,
            error: null,
            success: null,
        }
    },
    async mounted() {
        await this.load()
    },
    methods: {
        async load() {
            this.loading = true
            const [friends, pending, sent] = await Promise.all([
                this.friendsController.getFriends(),
                this.friendsController.getPendingReceived(),
                this.friendsController.getPendingSent(),
            ])
            this.friends = friends
            this.pendingRequests = pending
            this.pendingSent = sent
            this.loading = false
        },
        async sendRequest() {
            this.error = null
            this.success = null
            if (!this.friendEmail.trim()) return
            this.sending = true
            try {
                await this.friendsController.sendRequest(this.friendEmail.trim())
                this.friendEmail = ''
                this.success = 'Solicitação enviada!'
            } catch (e) {
                this.error = e.message
            }
            this.sending = false
        },
        async acceptRequest(id) {
            await this.friendsController.acceptRequest(id)
            await this.load()
        },
        async rejectRequest(id) {
            await this.friendsController.rejectRequest(id)
            await this.load()
        },
        goToFriend(id) {
            this.$emit('changeRoute', `page=friend&id=${id}`)
        },
    }
}
