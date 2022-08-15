export default {
    props: ['API_KEY', 'page'],
    emits: ['changeRoute'],
    template: `#index-template`,
    data() {
        return {}
    },
    created() {

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