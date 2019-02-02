<template lang="pug">
#firebaseui-auth-container  
</template>

<script>
import {auth, authProviders} from '~/plugins/firebase'
export default {
  name: 'Login',
  mounted() {
    if(process.browser){
      let firebaseui = require('firebaseui')
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)
      const config = {
        signInOptions: [
          authProviders.Google
        ],
        signInSuccessUrl: '/',
        tosUrl: '/tos',
        privacyPolicyUrl: '/privacy-policy',
        callbacks: {
          signInSuccessWithAuthResult() {
            console.log('sign in success with auth result')
          },
          uiShown() {
            console.log('ui shown')
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
