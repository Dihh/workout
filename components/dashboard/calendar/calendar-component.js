export default {
    template: `#calendar-template`,
    props: ['workouts', 'calendar', 'monthsName'],
    emits: ['changeMonth', 'selectDate'],
    data() {
        return {}
    },
    mounted() { },
    methods: {
        changeMonth(value) {
            this.$emit("changeMonth", value)
        },
        selectDate(date) {
            if (date) this.$emit("selectDate", date)
        }
    }
}