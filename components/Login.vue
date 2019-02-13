<template lang="pug">
.login
	no-ssr
		#firebaseui-auth-container  
</template>

<script>
//import LoginForm from '~/components/account/LoginForm.vue'
import firebase from '~/node_modules/firebase/app'
import '~/node_modules/firebase/auth'
const { auth } = firebase

const authProviders = {
  Google: auth.GoogleAuthProvider.PROVIDER_ID,
  Facebook: auth.FacebookAuthProvider.PROVIDER_ID,
  Twitter: auth.TwitterAuthProvider.PROVIDER_ID,
  Email: auth.EmailAuthProvider.PROVIDER_ID,
  Phone: auth.PhoneAuthProvider.PROVIDER_ID,
}

export default {
	middleware: 'anonymous',
	watch: {
		// firebase is sometimes slow so we need to account for
		// the user getting authenticated late in the game...
		user (to, from) {
			this.$emit('close')
			//this.$router.push('/')
			//this.$router.go(-2)
		},
	},
	computed: {
		user(){
			return this.$store.getters['users/user']
		}
	},
  mounted() {
    let vm = this
    if(process.browser){
//      let firebaseui = require('~/assets/firebaseui')
      let firebaseui = require('~/node_modules/firebaseui/dist/npm')
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
        //signInSuccessUrl: '/',
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
    }
  }
}
</script>

<style src='~/node_modules/firebaseui/dist/firebaseui.css'>

</style>
