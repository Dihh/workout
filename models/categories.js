import { API_URL, requestPost } from '../main.js'
const API_KEY = localStorage.API_KEY

export const categories = {
    removeCategory: async (id) => {
        const boddy = {
            "route": "/delete-category",
            "id": id
        }
        return await requestPost(boddy, `${API_URL}?apiKey=${API_KEY}`)
    },

    getCategory: async (id) => {
        return await (await fetch(`${API_URL}?apiKey=${API_KEY}&route=/get-category&id=${id}`)).json()
    },

    getCategories: async () => {
        return await (await fetch(`${API_URL}?apiKey=${API_KEY}&route=/get-categories`)).json()
    },

    createCategory: async (category) => {
        const boddy = {
            "route": "/create-category",
            "name": category.name
        }
        return await requestPost(boddy, `${API_URL}?apiKey=${API_KEY}`)
    },

    updateCategory: async (id, category) => {
        const boddy = {
            "route": "/update-category",
            "id": id,
            "name": category.name
        }
        return await requestPost(boddy, `${API_URL}?apiKey=${API_KEY}`)
    }
}