import { getParam } from '../../../main.js'
import { requests } from '../../../requests.js'

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
            this.category = await requests.categories.getCategory(id)
            this.loading = false
        },
        edit() {
            location.href = `?page=categorias-form&id=${this.id}`
        },
        async remove() {
            this.loading = true
            await requests.categories.removeCategory(this.id)
            location.href = `?page=categorias`
        },
    }
}