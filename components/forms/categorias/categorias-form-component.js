import { getParam, uuidv4 } from '../../../main.js'
import { CategoryController } from '../../../controllers/category.js'

export default {
    template: `#categorias-form-template`,
    data() {
        return {
            loading: true,
            id: '',
            category: {},
            categoryController: new CategoryController()
        }
    },
    beforeMount() {
        this.id = getParam('id')
        if (this.id) {
            this.getCategory(this.id)
        } else {
            this.loading = false
        }
    },
    methods: {
        async createCategory() {
            this.loading = true
            await this.categoryController.insert(this.category)
            const link = `page=categoria&id=${this.category.id}`
            this.$emit("changeRoute", link)
        },
        async updateCategory() {
            this.loading = true
            await this.categoryController.update(this.category)
            const link = `page=categoria&id=${this.id}`
            this.$emit("changeRoute", link)
        },
        async getCategory() {
            this.category = await this.categoryController.select_id(this.id)
            this.loading = false
        },
        submit() {
            event.preventDefault()
            if (this.id) {
                this.updateCategory()
            } else {
                this.createCategory()
            }
        }
    }
}