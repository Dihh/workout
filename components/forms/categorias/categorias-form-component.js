const { createApp } = Vue

export default createApp({
    template: `#categorias-form-template`,
    data() {
        return {}
    },
    beforeMount() { },
    methods: {
        send() {
            history.back()
        }
    }
})