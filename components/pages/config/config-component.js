import { signOutUser } from '../../../firebase.js'

export default {
    props: ['user'],
    template: `#config-template`,
    data() {
        return {
            loading: false,
        }
    },
    beforeMount() {},
    methods: {
        goTo(page) {
            let link = `page=${page}`
            this.$emit("changeRoute", link)
        },
        async logout() {
            await signOutUser()
        },
    }
}
