import { API_URL } from '../../../main.js'

export default {
    template: `#categorias-list-template`,
    props: ['API_KEY'],
    data() {
        return {
            categories: [],
            timer: null,
        }
    },
    mounted() {
        this.getCategories();
    },
    methods: {
        goTo(page) {
            location.href = `?page=${page}`
        },
        async getCategories() {
            this.categories = await (await fetch(`${API_URL}?apiKey=${this.API_KEY}&route=/get-categories`)).json()
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