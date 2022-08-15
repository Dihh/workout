import { exerciseTable } from '../../../models/exercises.js';

export default {
    template: `#exercises-list-template`,
    emits: ['changeRoute'],
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
            let link = `page=${page}`
            if (id) link += `&id=${id}`
            this.$emit("changeRoute", link)
        },
        async getExercises() {
            this.exercises = await exerciseTable.select()
        },
    }
}