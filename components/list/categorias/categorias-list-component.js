const { createApp } = Vue

export default createApp({
    template: `#categorias-list-template`,
    data() {
        return {}
    },
    beforeMount() { },
    methods: {
        goTo(page) {
            location.href = `?page=${page}`
        }
    }
})