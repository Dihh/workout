import { LocationController } from '../../../controllers/location.js'

export default {
    template: `#locations-list-template`,
    emits: ['changeRoute'],
    data() {
        return {
            locations: null,
            loading: true,
            locationController: new LocationController()
        }
    },
    mounted() {
        this.getLocations();
    },
    methods: {
        goTo(page, id) {
            let link = `page=${page}`
            if (id) link += `&id=${id}`
            this.$emit("changeRoute", link)
        },
        async getLocations() {
            this.locations = await this.locationController.select()
            this.loading = false;
        },
    }
}