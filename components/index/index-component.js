export default {
    props: ['API_KEY', 'page', 'user'],
    emits: ['changeRoute', 'apiKey', 'signOut'],
    template: `#index-template`,
    data() {
        return {}
    },
    methods: {
        setApiKey(API_KEY) {
            this.$emit("apiKey", API_KEY)
        },
        changeRoute(page) {
            this.$emit("changeRoute", page)
        }
    }
}
