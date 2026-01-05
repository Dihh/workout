import { getParam } from '../../../main.js'
import { CategoryController } from '../../../controllers/category.js'


export default {
    template: `#categoria-template`,
    data() {
        return {
            category: null,
            id: '',
            loading: true,
            categoryController: new CategoryController()
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getCategory(this.id)
    },
    methods: {
        async getCategory(id) {
            this.category = await this.categoryController.select_id(id)
            this.loading = false
        },
        edit() {
            const link = `page=categorias-form&id=${this.id}`
            this.$emit("changeRoute", link)
        },
        async remove() {
            this.loading = true
            await this.categoryController.delete(this.id)
            const link = `page=categorias`
            this.$emit("changeRoute", link)
        },
    }
}