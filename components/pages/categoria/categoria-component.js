import { API_URL, getParam, requestPost } from '../../../main.js'

export default {
    props: ['API_KEY'],
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
            this.category = await (await fetch(`${API_URL}?apiKey=${this.API_KEY}&route=/get-category&id=${id}`)).json()
            this.loading = false
        },
        edit() {
            location.href = `?page=categorias-form&id=${this.id}`
        },
        async remove() {
            const boddy = {
                "route": "/delete-category",
                "id": this.id
            }
            this.loading = true
            await requestPost(boddy, `${API_URL}?apiKey=${this.API_KEY}`)
            history.back()
        },
    }
}