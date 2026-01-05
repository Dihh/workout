import { CategoryController } from '../../../controllers/category.js'

export default {
    template: `#categorias-list-template`,
    emits: ['changeRoute'],
    data() {
        return {
            categories: null,
            loading: true,
            categoryController: new CategoryController()
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
            this.categories = await this.categoryController.select()
            this.loading = false;
        },
    }
}