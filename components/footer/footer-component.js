const { createApp } = Vue

export default createApp({
    template: `#footer-template`,
    data() {
        return {
            page: ''
        }
    },
    created() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        this.page = params.page
    },
    methods: {
        goTo(page) {
            location.href = `?page=${page}`
        }
    }
})