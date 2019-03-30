<template lang="pug">
.login
	no-ssr
		#firebaseui-auth-container  
</template>

<script>

export default {
	middleware: 'anonymous',
	watch: {
		user (to, from) {
			this.$emit('close')
		},
	},
	computed: {
		user(){
			return this.$store.getters['users/user']
		}
	},
  async mounted() {
    let vm = this
    if(process.browser){
      try{
        let [ firebaseui, firebase ] = await Promise.all([
          import('firebaseui'),
          import('firebase/app')
        ])
        await import('firebase/auth')
        const {auth} = firebase
        const authProviders = {
          Google: auth.GoogleAuthProvider.PROVIDER_ID,
          Facebook: auth.FacebookAuthProvider.PROVIDER_ID,
          Twitter: auth.TwitterAuthProvider.PROVIDER_ID,
          Email: auth.EmailAuthProvider.PROVIDER_ID,
          Phone: auth.PhoneAuthProvider.PROVIDER_ID,
        }

        let ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth())
        const config = {
          signInFlow: 'popup',
          signInOptions: [
            authProviders.Google,
            authProviders.Facebook,
            authProviders.Twitter,
            authProviders.Email,
            {
              provider: authProviders.Phone,
              defaultCountry: 'ID',
              whitelistedCountries: ['ID', '+62']
            },
          ],
          tosUrl: '/tos',
          privacyPolicyUrl: '/privacy-policy',
          callbacks: {
            signInSuccessWithAuthResult(authResult) {
              vm.$store.commit('users/setUser', JSON.parse(JSON.stringify(authResult.user)))
              vm.$nuxt.$loading.finish()
              vm.$toast.success('login sukses')
              
              return false
            },
            signInFailure(error) {
              vm.$toast.error('ada error')
              return false;
            },
          }
        }

        ui.start('#firebaseui-auth-container', config)
      }catch(err){
        throw err
      }

    }
  }
}
</script>

<style src='~/node_modules/firebaseui/dist/firebaseui.css'>

</style>
