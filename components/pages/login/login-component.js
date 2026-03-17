import { signInWithGoogle } from '../../../firebase.js'

export default {
    template: '#login-template',
    data() {
        return {
            loading: false,
            error: null
        }
    },
    methods: {
        async signIn() {
            this.loading = true
            this.error = null
            try {
                await signInWithGoogle()
            } catch (e) {
                console.log(e)
                this.error = 'Erro ao entrar. Tente novamente.'
                this.loading = false
            }
        }
    }
}
