export default {
    template: `#api-key-form-template`,
    data() {
        return {
            API_KEY: ''
        }
    },
    methods: {
        async send() {
            localStorage.API_KEY = this.API_KEY
            this.$emit("apiKey", this.API_KEY)
        }
    }
}