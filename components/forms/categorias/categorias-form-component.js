import { getParam, uuidv4 } from '../../../main.js'
import { categoryTable } from '../../../models/categories.js'

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
            await categoryTable.insert(this.category)
            location.href = `?page=categoria&id=${this.category.id}`
        },
        async updateCategory() {
            this.loading = true
            await categoryTable.update(this.category)
            location.href = `?page=categoria&id=${this.id}`
        },
        async getCategory() {
            this.category = await categoryTable.select_id(this.id)
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