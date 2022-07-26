export default {
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
    methods: {}
}