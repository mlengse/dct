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
      console.log('ready logout')
      firebase.auth().signOut()
      this.$toast.info('Anda sudah logout')
      this.$store.commit('users/emptyUser')
      if(typeof window !== 'undefined' && window.location) {
        window.location.reload(true)
      }
    }
  },
  mounted() {
    let vm = this
    if(process.browser){
      let firebaseui = require('firebaseui')
      let ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
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
       // signInSuccessUrl: '/',
        tosUrl: '/tos',
        privacyPolicyUrl: '/privacy-policy',
        callbacks: {
          signInSuccessWithAuthResult(authResult) {
            vm.$store.commit('users/saveUser', JSON.parse(JSON.stringify(authResult.user)))
            vm.$nuxt.$loading.finish()
            vm.$toast.success('login sukses')
            return false
          },
          signInFailure(error) {
            vm.$toast.error('ada error')
            return false;
          },
          uiShown() {
   //         vm.$toast.info('ui show')            
          }
        }
      }

      let user = firebase.auth().currentUser
      if(!user){
        ui.start('#firebaseui-auth-container', config)
      } else {
        vm.$store.commit('users/saveUser', JSON.parse(JSON.stringify(user)))
      }
    }
  }
}
</script>


<style src='~/node_modules/firebaseui/dist/firebaseui.css'>

</style>
