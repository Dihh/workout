import { requests } from '../../../requests.js'

export default {
    template: `#exercises-list-template`,
    data() {
        return {
            exercises: [],
            timer: null,
        }
    },
    mounted() {
        this.getExercises();
    },
    methods: {
        goTo(page, id) {
            let link = `?page=${page}`
            if (id) link += `&id=${id}`
            location.href = link
        },
        async getExercises() {
            this.exercises = await requests.getExercises()
        },
    }
}