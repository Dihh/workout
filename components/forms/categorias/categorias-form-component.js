import { API_URL, getParam, requestPost } from '../../../main.js'

export default {
    props: ['API_KEY'],
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
            const boddy = {
                "route": "/create-category",
                "name": this.category.name
            }
            this.loading = true
            await requestPost(boddy, `${API_URL}?apiKey=${this.API_KEY}`)
            history.back()
        },
        async updateCategory() {
            const boddy = {
                "route": "/update-category",
                "id": this.id,
                "name": this.category.name
            }
            this.loading = true
            await requestPost(boddy, `${API_URL}?apiKey=${this.API_KEY}`)
            history.back()
        },
        async getCategory(id) {
            this.category = await (await fetch(`${API_URL}?apiKey=${this.API_KEY}&route=/get-category&id=${id}`)).json()
            this.loading = false
        }
    }
}