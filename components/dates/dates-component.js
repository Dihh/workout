import { months, weekDays } from '../../dates-utils.js'
export default {
    template: `#dates-template`,
    props: ['date'],
    data() {
        return {
            dates: [],
        }
    },
    beforeMount() {
        console.log(this.date)
        const tenElements = Array.from(Array(10).keys())
        this.dates = tenElements.map(el => {
            const today = this.date ? new Date(this.date) : new Date()
            const days = today.setDate(today.getDate() + (el - 5))
            const elementDate = new Date(days)
            const stringDate = elementDate.toISOString().split("T")[0]
            const cardClass = []
            if(stringDate == (new Date()).toISOString().split("T")[0]){
                cardClass.push("date-today" )
            }
            if (stringDate == this.date){
                cardClass.push("date-selected")
            }
            return {
                day: elementDate.getDate(),
                month: months[elementDate.getMonth() + 1],
                weekDay: weekDays[elementDate.getDay()],
                stringDate,
                cardClass: cardClass.join(" ")
            }
        })
    },
    mounted() {
        document.querySelector(".dates").scrollLeft = 75 * 4 + 10 * 4
    },
    methods: {
        setDate(date) {
            this.$emit("changeDate", date)
        }
    }
}