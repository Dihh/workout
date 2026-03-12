import { months } from '../../dates-utils.js'
import { DayWorkoutsController } from '../../controllers/day-workouts.js';

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
            monthsName: '',
            totalWorkouts: 0,
            dayWorkoutsController: new DayWorkoutsController(),
        }
    },
    mounted() {
        elementChart = null
        this.getDashboard()

    },
    methods: {
        async getWorkouts(initial_date, final_date) {
            this.workouts = await this.dayWorkoutsController.select_between_date(initial_date, final_date)
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
            let nextMont = (parseInt(diaArr[1]) + 1)
            if (nextMont > 12){
                diaArr[0] = parseInt(this.year) + 1
                diaArr[1] = 1
            } else {
                diaArr[1] = nextMont
            }
            const nextMonthFirstDay = new Date(`${diaArr.join("-")} 00:00:000`)
            const lasttDay = new Date(nextMonthFirstDay.setDate(nextMonthFirstDay.getDate() - 1))
            const lastDayWeekDay = lasttDay.getDay()
            this.finalDay = new Date(lasttDay.setDate(lasttDay.getDate() + (7 - lastDayWeekDay)))
        },
        async getDashboard() {
            this.getDates()
            const initialDate = this.firstDay.toISOString().split("T")[0]
            const finalData = this.finalDay.toISOString().split("T")[0]
            await this.getWorkouts(initialDate, finalData)
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
            this.totalWorkouts = this.calendarData.filter(d => d.workout).length

            const canvas = document.getElementById('chart')
            const ctx = canvas.getContext('2d')
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight || 200)
            gradient.addColorStop(0, 'rgba(100, 25, 135, 0.35)')
            gradient.addColorStop(1, 'rgba(100, 25, 135, 0.00)')

            const maxY = Math.max(...chartData, 5)

            const data = {
                labels: labels,
                datasets: [{
                    label: 'Treinos acumulados',
                    backgroundColor: gradient,
                    borderColor: '#641987',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#641987',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: true,
                    tension: 0.4,
                    data: chartData,
                }]
            };

            const config = {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#641987',
                            titleFont: { size: 12 },
                            bodyFont: { size: 13 },
                            padding: 10,
                            callbacks: {
                                label: ctx => ` ${ctx.parsed.y} treinos`
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: { font: { size: 11 }, color: '#999', maxTicksLimit: 10 }
                        },
                        y: {
                            min: 0,
                            max: maxY + 2,
                            grid: { color: '#f0f0f0' },
                            ticks: { font: { size: 11 }, color: '#999', stepSize: 1 }
                        }
                    }
                }
            };
            if (!elementChart) {
                elementChart = new Chart(canvas, config);
            } else {
                elementChart.data = data
                elementChart.options.scales.y.max = maxY + 2
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