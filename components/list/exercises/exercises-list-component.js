import { exerciseTable } from '../../../models/exercises.js';

export default {
    template: `#exercises-list-template`,
    data() {
        return {
            exercises: null,
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
            this.exercises = await exerciseTable.select()
        },
    }
}