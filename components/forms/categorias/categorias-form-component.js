import { getParam } from '../../../main.js'
import { requests } from '../../../requests.js'

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
            const category = await requests.categories.createCategory(this.category)
            location.href = `?page=categoria&id=${category.id}`
        },
        async updateCategory() {
            this.loading = true
            const category = await requests.categories.updateCategory(this.id, this.category)
            location.href = `?page=categoria&id=${category.id}`
        },
        async getCategory() {
            this.category = await requests.categories.getCategory(this.id)
            this.loading = false
        }
    }
}