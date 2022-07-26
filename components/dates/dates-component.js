import months from '../../month-names.js'
export default {
    template: `#dates-template`,
    data() {
        return {
            dates: []
        }
    },
    beforeMount() {
        const tenElements = Array.from(Array(10).keys())
        this.dates = tenElements.map(el => {
            const today = new Date()
            const days = today.setDate(today.getDate() + (el - 5))
            const elementDate = new Date(days)
            return { day: elementDate.getDate(), month: months[elementDate.getMonth() + 1] }
        })
    },
    mounted() {
        document.querySelector(".dates").scrollLeft = 75 * 4 + 10 * 4
    },
    methods: {}
}