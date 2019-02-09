<template lang="pug">
.login
  no-ssr
    firebase-ui
</template>

<script>
//import LoginForm from '~/components/account/LoginForm.vue'
import FirebaseUi from '~/components/FirebaseUi.vue'

export default {
  middleware: 'anonymous',
  components: {
    FirebaseUi
  },
  watch: {
    // firebase is sometimes slow so we need to account for
    // the user getting authenticated late in the game...
    user (to, from) {
      this.$router.push('/')
      //this.$router.go(-2)
    }
  },
  computed: {
    user(){
      return this.$store.getters['users/user']
    }
  }
}
</script>
