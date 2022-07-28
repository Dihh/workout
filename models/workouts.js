import { API_URL, requestPost } from '../main.js'
const API_KEY = localStorage.API_KEY

export const workouts = {
    removeWorkout: async (id) => {
        const boddy = {
            "route": "/delete-workout",
            "id": id
        }
        return await requestPost(boddy, `${API_URL}?apiKey=${API_KEY}`)
    },
    getWorkout: async (id) => {
        return await (await fetch(`${API_URL}?apiKey=${API_KEY}&route=/get-workout&id=${id}`)).json()
    },
    getWorkouts: async () => {
        const resp = await fetch(`${API_URL}?apiKey=${API_KEY}&route=/get-workouts`)
        return await resp.json()
    },
    createWorkout: async (workout) => {
        const boddy = {
            "route": "/create-workout",
            "exercise_id": workout.exercise_id,
            "date": workout.date,
            "weight": workout.weight
        }
        return await requestPost(boddy, `${API_URL}?apiKey=${API_KEY}`)
    },
    updateWorkout: async (id, workout) => {
        const boddy = {
            "route": "/update-workout",
            "id": id,
            "exercise_id": workout.exercise_id,
            "date": workout.date,
            "weight": workout.weight
        }
        return await requestPost(boddy, `${API_URL}?apiKey=${API_KEY}`)
    }
}