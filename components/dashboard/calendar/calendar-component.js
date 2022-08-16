export default {
    template: `#calendar-template`,
    props: ['workouts', 'calendar', 'monthsName'],
    emits: ['changeMonth'],
    data() {
        return {}
    },
    mounted() { },
    methods: {
        changeMonth(value) {
            this.$emit("changeMonth", value)
        }
    }
}