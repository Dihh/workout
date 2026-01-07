export default {
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
    }
}