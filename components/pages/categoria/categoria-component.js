import { getParam } from '../../../main.js'
import { CategoryController } from '../../../controllers/category.js'
import { ExerciseController } from '../../../controllers/exercise.js'
import { DayWorkoutsController } from '../../../controllers/day-workouts.js'

export default {
    template: `#categoria-template`,
    data() {
        return {
            category: null,
            exercises: [],
            id: '',
            loading: true,
            categoryController: new CategoryController(),
            exerciseController: new ExerciseController(),
            dayWorkoutsController: new DayWorkoutsController(),
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this._chart = null
        this.getCategory(this.id)
    },
    beforeUnmount() {
        this._chart?.destroy()
    },
    methods: {
        async getCategory(id) {
            this.category = await this.categoryController.select_id(id)
            this.exercises = await this.exerciseController.select_by_category(id)
            this.loading = false
            await this.$nextTick()
            await this.buildChart()
        },
        async buildChart() {
            const allRecords = (await Promise.all(
                this.exercises.map(ex => this.dayWorkoutsController.select_by_exercise(ex.id))
            )).flat()

            const today = new Date()
            const last30 = Array.from({ length: 30 }, (_, i) => {
                const d = new Date(today)
                d.setDate(d.getDate() - (29 - i))
                return d.toISOString().split('T')[0]
            })

            // unique training days per date (at least 1 exercise of this category)
            const daysWithTraining = new Set(
                allRecords
                    .filter(r => r.date >= last30[0])
                    .map(r => r.date)
            )

            const labels = last30.map(d => d.slice(5).replace('-', '/'))
            const data = last30.map(day =>
                [...daysWithTraining].filter(d => d <= day).length
            )

            const canvas = document.getElementById('cat-chart')
            const ctx = canvas.getContext('2d')
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight || 160)
            gradient.addColorStop(0, 'rgba(100,25,135,0.35)')
            gradient.addColorStop(1, 'rgba(100,25,135,0)')

            if (this._chart) this._chart.destroy()
            this._chart = new Chart(canvas, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        data,
                        borderColor: '#641987',
                        backgroundColor: gradient,
                        borderWidth: 2.5,
                        pointBackgroundColor: '#641987',
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        fill: true,
                        tension: 0.4,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#641987',
                            callbacks: { label: ctx => ` ${ctx.parsed.y} treinos` }
                        }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#999', maxTicksLimit: 8 } },
                        y: { min: 0, grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 }, color: '#999', stepSize: 1 } }
                    }
                }
            })
        },
        edit() {
            this.$emit("changeRoute", `page=categorias-form&id=${this.id}`)
        },
        async remove() {
            this.loading = true
            await this.categoryController.delete(this.id)
            this.$emit("changeRoute", `page=categorias`)
        },
    }
}
