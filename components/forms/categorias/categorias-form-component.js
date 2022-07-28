import { getParam, uuidv4 } from '../../../main.js'
import { categoria_table } from '../../../models/categories.js'

export default {
    template: `#categorias-form-template`,
    data() {
        return {
            loading: true,
            id: '',
            category: {}
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
            this.category.id = uuidv4()
            await categoria_table.insert(this.category)
            location.href = `?page=categoria&id=${this.category.id}`
        },
        async updateCategory() {
            this.loading = true
            await categoria_table.update(this.category)
            location.href = `?page=categoria&id=${this.id}`
        },
        async getCategory() {
            this.category = await categoria_table.select_id(this.id)
            this.loading = false
        }
    }
}