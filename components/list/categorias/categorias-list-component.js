import { requests } from '../../../requests.js'

export default {
    template: `#categorias-list-template`,
    data() {
        return {
            categories: null,
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
            this.categories = await requests.categories.getCategories()
        },
    }
}