import { categoryTable } from '../../../models/categories.js'

export default {
    template: `#categorias-list-template`,
    emits: ['changeRoute'],
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
            let link = `page=${page}`
            if (id) link += `&id=${id}`
            this.$emit("changeRoute", link)
        },
        async getCategories() {
            this.categories = await categoryTable.select()
        },
    }
}