<template lang="pug">
#firebaseui-auth-container  
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import config from '~/firebaseConfig.js'

if(!firebase.apps.length){
  firebase.initializeApp(config)
}

const authProviders = {
  Google: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  Facebook: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  Twitter: firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  Email: firebase.auth.EmailAuthProvider.PROVIDER_ID,
  Phone: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
}

export default {
  name: 'Login',
  props: ['logout'],
  watch: {
    logout(val) {
      firebase.auth().signOut()
      this.$toast.info('Anda sudah logout')
    }
  },
  mounted() {
    let vm = this
    if(process.browser){
      let firebaseui = require('firebaseui')
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
      const config = {
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
        signInSuccessUrl: '/',
        tosUrl: '/tos',
        privacyPolicyUrl: '/privacy-policy',
        callbacks: {
          signInSuccessWithAuthResult(authResult) {
            vm.$store.commit('users/saveUser', JSON.parse(JSON.stringify(authResult.user)))
            vm.$nuxt.$loading.finish()
            vm.$toast.success('login sukses')
          }
        }
      }
      ui.start('#firebaseui-auth-container', config)
    }
  }
}
</script>


<style src='~/node_modules/firebaseui/dist/firebaseui.css'>

</style>
