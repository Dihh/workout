import { API_URL } from '../../../main.js'

export default {
    template: `#categorias-list-template`,
    props: [],
    data() {
        return {
            categories: [],
            timer: null,
        }
    },
    mounted() {
        this.getCategories();
    },
    created() {
        console.log(this.message)
    },
    methods: {
        goTo(page) {
            location.href = `?page=${page}`
        },
        async getCategories() {
            const API_KEY = localStorage.API_KEY
            this.categories = await (await fetch(`${API_URL}?apiKey=${API_KEY}&route=/get-categories`)).json()
        },
        touchstart() {
            console.log('touchstart')
            const touchduration = 500
            this.timer = setTimeout(this.onlongtouch, touchduration);
        },
        touchend() {
            console.log('touchend')
            if (this.timer) clearTimeout(this.timer);
        },
        onlongtouch() {
            console.log("onlongtouch")
        }
    }
}