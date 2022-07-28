import { API_URL, requestPost } from './main.js'
const API_KEY = localStorage.API_KEY

export const requests = {
    removeCategory: async (id, route) => {
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
    },

    removeExercise: async (id, route) => {
        const boddy = {
            "route": "/delete-exercise",
            "id": id
        }
        return await requestPost(boddy, `${API_URL}?apiKey=${API_KEY}`)
    },
    getExercise: async (id) => {
        return await (await fetch(`${API_URL}?apiKey=${API_KEY}&route=/get-exercise&id=${id}`)).json()
    },
    getExercises: async () => {
        return await (await fetch(`${API_URL}?apiKey=${API_KEY}&route=/get-exercises`)).json()
    },
    createExercise: async (exercise) => {
        const boddy = {
            "route": "/create-exercise",
            "name": exercise.name,
            "category_id": exercise.category_id
        }
        return await requestPost(boddy, `${API_URL}?apiKey=${API_KEY}`)
    },
    updateExercise: async (id, exercise) => {
        const boddy = {
            "route": "/update-exercise",
            "id": id,
            "name": exercise.name,
            "category_id": exercise.category_id
        }
        return await requestPost(boddy, `${API_URL}?apiKey=${API_KEY}`)
    }
}