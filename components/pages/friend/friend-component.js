import { getParam } from '../../../main.js'
import { FriendsController } from '../../../controllers/friends.js'
import { auth } from '../../../firebase.js'

export default {
    template: `#friend-template`,
    emits: ['changeRoute'],
    data() {
        return {
            loading: true,
            id: '',
            friend: null,
            friendsController: new FriendsController(),
        }
    },
    async beforeMount() {
        this.id = getParam('id')
        const request = await this.friendsController.getRequest(this.id)
        if (request) {
            const uid = auth.currentUser?.uid
            const isSender = request.from_uid === uid
            this.friend = {
                name: isSender ? request.to_name : request.from_name,
                email: isSender ? request.to_email : request.from_email,
            }
        }
        this.loading = false
    },
    methods: {
        async remove() {
            if (!confirm('Desfazer amizade?')) return
            this.loading = true
            await this.friendsController.removeFriend(this.id)
            this.$emit('changeRoute', 'page=friends')
        }
    }
}
