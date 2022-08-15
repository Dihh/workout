import { getParam } from '../../../main.js'
import { categoryTable } from '../../../models/categories.js'

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
            this.category = await categoryTable.select_id(id)
            this.loading = false
        },
        edit() {
            const link = `page=categorias-form&id=${this.id}`
            this.$emit("changeRoute", link)
        },
        async remove() {
            this.loading = true
            await categoryTable.delete(this.id)
            const link = `page=categorias`
            this.$emit("changeRoute", link)
        },
    }
}