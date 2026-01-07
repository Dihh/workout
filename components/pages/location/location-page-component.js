import { getParam } from '../../../main.js'
import { LocationController } from '../../../controllers/location.js'


export default {
    template: `#location-template`,
    data() {
        return {
            location: null,
            id: '',
            loading: true,
            locationController: new LocationController()
        }
    },
    beforeMount() {
        this.id = getParam('id')
        this.getLocation(this.id)
    },
    methods: {
        async getLocation(id) {
            this.location = await this.locationController.select_id(id)
            this.loading = false
        },
        edit() {
            const link = `page=location-form&id=${this.id}`
            this.$emit("changeRoute", link)
        },
        async remove() {
            this.loading = true
            await this.locationController.delete(this.id)
            const link = `page=locations-list`
            this.$emit("changeRoute", link)
        },
    }
}