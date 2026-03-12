import { months, weekDays } from '../../dates-utils.js'

const CARD_WIDTH = 76  // 68px width + 8px margin-right

export default {
    template: `#dates-template`,
    props: ['date'],
    data() {
        return {
            dates: [],
            _expanding: false,
            todayStr: new Date(Date.UTC(
                new Date().getFullYear(), new Date().getMonth(), new Date().getDate()
            )).toISOString().split('T')[0],
        }
    },
    computed: {
        isNotToday() {
            return this.date !== this.todayStr
        }
    },
    beforeMount() {
        const center = this.date ? new Date(this.date) : new Date()
        this.dates = Array.from({ length: 10 }, (_, i) => this.buildDateCard(center, i - 5))
    },
    mounted() {
        const el = document.querySelector('.dates')
        el.scrollLeft = CARD_WIDTH * 5
        el.addEventListener('scroll', this.onScroll, { passive: true })
    },
    beforeUnmount() {
        document.querySelector('.dates')?.removeEventListener('scroll', this.onScroll)
    },
    methods: {
        buildDateCard(baseDate, offset) {
            const d = new Date(baseDate)
            const ts = d.setDate(d.getDate() + offset)
            const tz = new Date().getTimezoneOffset() * 60 * 1000
            const elementDate = new Date(ts + tz)
            const stringDate = elementDate.toISOString().split('T')[0]
            const todayStr = new Date().toISOString().split('T')[0]
            const cardClass = []
            if (stringDate === todayStr) cardClass.push('date-today')
            if (stringDate === this.date) cardClass.push('date-selected')
            return {
                day: elementDate.getDate(),
                month: months[elementDate.getMonth() + 1],
                weekDay: weekDays[elementDate.getDay()],
                stringDate,
                cardClass: cardClass.join(' ')
            }
        },
        onScroll() {
            if (this._expanding) return
            const el = document.querySelector('.dates')
            if (!el) return

            if (el.scrollLeft < CARD_WIDTH * 2) {
                this._expanding = true
                const firstDate = new Date(this.dates[0].stringDate)
                const newDates = Array.from({ length: 5 }, (_, i) => this.buildDateCard(firstDate, i - 5))
                this.dates = [...newDates, ...this.dates]
                this.$nextTick(() => {
                    el.scrollLeft += CARD_WIDTH * 5
                    this._expanding = false
                })
            } else if (el.scrollWidth - el.scrollLeft - el.clientWidth < CARD_WIDTH * 2) {
                this._expanding = true
                const lastDate = new Date(this.dates[this.dates.length - 1].stringDate)
                const newDates = Array.from({ length: 5 }, (_, i) => this.buildDateCard(lastDate, i + 1))
                this.dates = [...this.dates, ...newDates]
                this.$nextTick(() => { this._expanding = false })
            }
        },
        setDate(date) {
            this.$emit('changeDate', date)
        },
        goToToday() {
            const today = new Date()
            const todayStr = new Date(
                Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
            ).toISOString().split('T')[0]
            this.$emit('changeDate', todayStr)
        }
    }
}
