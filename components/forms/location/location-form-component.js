import { getParam } from '../../../main.js'
import { LocationController } from '../../../controllers/location.js'

export default {
    template: `#location-form-template`,
    data() {
        return {
            loading: true,
            id: '',
            location: {},
            locationController: new LocationController()
        }
    },
    beforeMount() {
        this.id = getParam('id')
        if (this.id) {
            this.getLocation(this.id)
        } else {
            this.loading = false
        }
    },
    methods: {
        async createLocation() {
            this.loading = true
            await this.locationController.insert(this.location)
            const link = `page=location&id=${this.location.id}`
            this.$emit("changeRoute", link)
        },
        async updateLocation() {
            this.loading = true
            await this.locationController.update(this.location)
            const link = `page=location&id=${this.id}`
            this.$emit("changeRoute", link)
        },
        async getLocation() {
            this.location = await this.locationController.select_id(this.id)
            this.loading = false
        },
        submit() {
            event.preventDefault()
            if (this.id) {
                this.updateLocation()
            } else {
                this.createLocation()
            }
        }
    }
}