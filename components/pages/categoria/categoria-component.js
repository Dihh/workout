import { getParam } from '../../../main.js'
import { categoria_table } from '../../../models/categories.js'

export default {
    template: `#categoria-template`,
    data() {
        return {
            category: null,
            id: '',
            loading: true
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getCategory(this.id)
    },
    methods: {
        async getCategory(id) {
            this.category = await categoria_table.select_id(id)
            this.loading = false
        },
        edit() {
            location.href = `?page=categorias-form&id=${this.id}`
        },
        async remove() {
            this.loading = true
            await categoria_table.delete(this.id)
            location.href = `?page=categorias`
        },
    }
}