export default {
    props: ['API_KEY'],
    template: `#index-template`,
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
        setApiKey(API_KEY) {
            this.$emit("apiKey", API_KEY)
        }
    }
}