import { ExerciseController } from '../../../controllers/exercise.js';

export default {
    template: `#exercises-list-template`,
    emits: ['changeRoute'],
    data() {
        return {
            exercises: null,
            loading: true,
            exerciseController: new ExerciseController()
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
            this.exercises = await this.exerciseController.select()
            this.loading = false
        },
    }
}