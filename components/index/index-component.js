const { createApp } = Vue

export default createApp({
    template: `#index-template`,
    data() {
        return {
            message: "inde-component",
            i: 0
        }
    },
    computed() {
        this.updateTime()
    },
    methods: {
        updateTime() {
            console.log('here')
            this.i++
        }
    }
})