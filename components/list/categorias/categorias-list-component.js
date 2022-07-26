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
        goTo(page, id) {
            let link = `?page=${page}`
            if (id) link += `&id=${id}`
            location.href = link
        },
        async getCategories() {
            this.categories = await (await fetch(`${API_URL}?apiKey=${this.API_KEY}&route=/get-categories`)).json()
        },
    }
}