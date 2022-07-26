export default {
    props: [],
    template: `#head-template`,
    data() {
        return {}
    },
    beforeMount() { },
    methods: {
        apiKey() {
            location.href = '?page=api-key-form'
        }
    }
}