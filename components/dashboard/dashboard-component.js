import { dayWorkoutTable } from '../../models/days-workouts.js'
import { months } from '../../dates-utils.js'

let elementChart = null

export default {
    template: `#dashboard-template`,
    emits: ['changeRoute'],
    data() {
        return {
            workouts: [],
            firstDay: null,
            finalDay: null,
            calendar: [],
            calendarData: [],
            month: (new Date()).getMonth() + 1,
            year: (new Date()).getFullYear(),
            monthsName: ''
        }
    },
    mounted() {
        elementChart = null
        this.getDashboard()

    },
    methods: {
        async getWorkouts(initial_date, final_date) {
            this.workouts = await dayWorkoutTable.select_between_date(initial_date, final_date)
        },
        getDates() {
            this.monthsName = months[this.month]
            const month = this.month
            const year = this.year
            const dia = new Date(`${year}-${month}-01 00:00:000`)
            const diaArr = dia.toISOString().split("T")[0].split("-")
            diaArr[2] = "01"
            const firstDayMonthDay = new Date(`${diaArr.join("-")} 00:00:000`)
            const firstDayWeekDay = firstDayMonthDay.getDay()
            this.firstDay = new Date(firstDayMonthDay.setDate(firstDayMonthDay.getDate() - firstDayWeekDay))
            const nextMont = parseInt(diaArr[1]) + 1
            diaArr[1] = nextMont
            const nextMonthFirstDay = new Date(`${diaArr.join("-")} 00:00:000`)
            const lasttDay = new Date(nextMonthFirstDay.setDate(nextMonthFirstDay.getDate() - 1))
            const lastDayWeekDay = lasttDay.getDay()
            this.finalDay = new Date(lasttDay.setDate(lasttDay.getDate() + (7 - lastDayWeekDay)))
        },
        async getDashboard() {
            this.getDates()
            await this.getWorkouts(this.firstDay.toISOString().split("T")[0], this.finalDay.toISOString().split("T")[0])
            this.getCalendar()
            this.getChart()
        },
        getCalendar() {
            const calendar = [[]]
            let calendarDay = new Date(this.firstDay.getTime() + 100)
            let cont = 0
            let index = 0
            this.calendarData = []
            while (calendarDay <= this.finalDay && cont < 50) {
                index = calendar[index].length >= 7 ? index + 1 : index
                if (!calendar[index]) calendar[index] = [];
                const date = calendarDay.toISOString().split("T")[0]
                calendar[index].push({
                    workout: !!this.workouts.find(workout => workout.date == date),
                    day: date.split("-")[2]
                })
                this.calendarData.push(
                    {
                        workout: !!this.workouts.find(workout => workout.date == date),
                        day: date.split("-")[2],
                        date: calendarDay
                    }
                )
                calendarDay = new Date(calendarDay.setDate(calendarDay.getDate() + 1))
                cont++
            }
            this.calendar = calendar

        },
        getChart() {
            const labels = []
            const chartData = []
            this.calendarData.forEach(date => {
                labels.push(date.day)
                chartData.push(this.calendarData.filter(ele => ele.date < date.date && ele.workout == true).length)
            })
            const data = {
                labels: labels,
                datasets: [{
                    label: 'Dias Malhados',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: chartData,
                }]
            };

            const config = {
                type: 'line',
                data: data,
                options: {
                    scales: {
                        y: {
                            min: 0,
                            max: 40
                        }
                    }
                }
            };
            if (!elementChart) {
                elementChart = new Chart(
                    document.getElementById('chart'),
                    config
                );
            } else {
                elementChart.data.labels = labels
                elementChart.data = data
                elementChart.update()
            }
        },
        onchangeMonth(value) {
            this.month += value
            this.getDashboard()
        },
        goTo(page) {
            this.$emit("changeRoute", page)
        }
    }
}