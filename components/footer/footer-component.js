export default {
    props: ['page'],
    template: `#footer-template`,
    data() {
        return {}
    },
    maounted() { },
    methods: {
        goTo(page) {
            this.$emit("changeRoute", `page=${page}`)
        },
    }
}