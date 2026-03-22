import { getParam } from '../../../main.js'
import { LocationController } from '../../../controllers/location.js'
import { ExerciseController } from '../../../controllers/exercise.js'

export default {
    template: `#location-template`,
    emits: ['changeRoute'],
    data() {
        return {
            location: null,
            id: '',
            loading: true,
            saving: false,
            allExercises: [],
            selectedIds: [],
            originalIds: [],
            locationController: new LocationController(),
            exerciseController: new ExerciseController(),
        }
    },
    async beforeMount() {
        this.id = getParam('id')
        const [location, allExercises, locationExercises] = await Promise.all([
            this.locationController.select_id(this.id),
            this.exerciseController.select(),
            this.exerciseController.select_by_location(this.id),
        ])
        this.location = location
        this.allExercises = allExercises
        this.selectedIds = locationExercises.map(e => e.id)
        this.originalIds = [...this.selectedIds]
        this.loading = false
    },
    methods: {
        edit() {
            this.$emit('changeRoute', `page=location-form&id=${this.id}`)
        },
        async remove() {
            if (!confirm('Excluir local?')) return
            this.loading = true
            await this.locationController.delete(this.id)
            this.$emit('changeRoute', 'page=locations-list')
        },
        toggleExercise(id) {
            const idx = this.selectedIds.indexOf(id)
            if (idx === -1) this.selectedIds.push(id)
            else this.selectedIds.splice(idx, 1)
        },
        async saveExercises() {
            this.saving = true
            await this.exerciseController.saveLocationExercises(this.id, this.selectedIds, this.originalIds)
            this.originalIds = [...this.selectedIds]
            this.saving = false
        },
    }
}
