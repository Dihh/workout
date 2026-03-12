import { getParam } from '../../../main.js'
import { ExerciseController } from '../../../controllers/exercise.js'
import { DayWorkoutsController } from '../../../controllers/day-workouts.js'

export default {
    template: `#exercises-template`,
    data() {
        return {
            exercise: null,
            id: '',
            loading: true,
            exerciseController: new ExerciseController(),
            dayWorkoutsController: new DayWorkoutsController(),
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this._chartWeight = null
        this._chartExec = null
        this.getExercise()
    },
    beforeUnmount() {
        this._chartWeight?.destroy()
        this._chartExec?.destroy()
    },
    methods: {
        async getExercise() {
            this.exercise = await this.exerciseController.select_id(this.id)
            this.loading = false
            await this.$nextTick()
            await this.buildCharts()
        },
        async buildCharts() {
            const records = await this.dayWorkoutsController.select_by_exercise(this.id)

            const today = new Date()
            const last30 = Array.from({ length: 30 }, (_, i) => {
                const d = new Date(today)
                d.setDate(d.getDate() - (29 - i))
                return d.toISOString().split('T')[0]
            })

            // Chart 1 — weight per day (only days with data)
            const weightByDay = {}
            records.forEach(r => {
                if (!weightByDay[r.date] || r.weight > weightByDay[r.date])
                    weightByDay[r.date] = r.weight
            })
            const weightLabels = []
            const weightData = []
            last30.forEach(day => {
                if (weightByDay[day] !== undefined) {
                    weightLabels.push(day.slice(5).replace('-', '/'))
                    weightData.push(weightByDay[day])
                }
            })

            // Chart 2 — cumulative executions over last 30 days
            const execLabels = last30.map(d => d.slice(5).replace('-', '/'))
            const execData = last30.map(day =>
                records.filter(r => r.date >= last30[0] && r.date <= day).length
            )

            this.renderWeightChart(weightLabels, weightData)
            this.renderExecChart(execLabels, execData)
        },
        makeGradient(canvasId, colorStart, colorEnd) {
            const canvas = document.getElementById(canvasId)
            const ctx = canvas.getContext('2d')
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight || 160)
            gradient.addColorStop(0, colorStart)
            gradient.addColorStop(1, colorEnd)
            return { canvas, gradient }
        },
        renderWeightChart(labels, data) {
            const { canvas, gradient } = this.makeGradient('chart-weight', 'rgba(100,25,135,0.35)', 'rgba(100,25,135,0)')
            if (this._chartWeight) this._chartWeight.destroy()
            this._chartWeight = new Chart(canvas, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Carga (kg)',
                        data,
                        borderColor: '#641987',
                        backgroundColor: gradient,
                        borderWidth: 2.5,
                        pointBackgroundColor: '#641987',
                        pointRadius: 4,
                        pointHoverRadius: 6,
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
                            callbacks: { label: ctx => ` ${ctx.parsed.y} kg` }
                        }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#999' } },
                        y: { grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 }, color: '#999' } }
                    }
                }
            })
        },
        renderExecChart(labels, data) {
            const { canvas, gradient } = this.makeGradient('chart-exec', 'rgba(100,25,135,0.35)', 'rgba(100,25,135,0)')
            if (this._chartExec) this._chartExec.destroy()
            this._chartExec = new Chart(canvas, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Execuções',
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
                            callbacks: { label: ctx => ` ${ctx.parsed.y} execuções` }
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
            const link = `page=exercise-form&id=${this.id}`
            this.$emit("changeRoute", link)
        },
        async remove() {
            this.loading = true
            await this.exerciseController.delete(this.id)
            this.$emit("changeRoute", `page=exercises`)
        },
    }
}
