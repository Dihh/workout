import { API_URL } from '../../../main.js'

export default {
    props: ['API_KEY'],
    template: `#categorias-form-template`,
    data() {
        return {
            name: ''
        }
    },
    beforeMount() { },
    methods: {
        async createCategory() {
            const API_KEY = localStorage.API_KEY
            const DATA = {
                "route": "/create-category",
                "name": this.name
            }
            const body = JSON.stringify(DATA)
            const headers = {
                'Content-Type': "text/plain;charset=utf-8",
            }
            this.categories = await (await fetch(`${API_URL}?apiKey=${this.API_KEY}`, { method: "POST", headers, body, redirect: "follow" })).json()
            history.back()
        }
    }
}