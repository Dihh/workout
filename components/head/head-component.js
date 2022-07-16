const { createApp } = Vue

export default createApp({
    template: `#head-template`,
    data() {
        return {
            logout: 'logout12'
        }
    },
    beforeMount() {
        console.log("here")
    }
})