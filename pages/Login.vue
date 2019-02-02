<template lang="pug">
	.login
		no-ssr
			firebase-ui
</template>

<script>
import FirebaseUi from '~/components/FirebaseUi.vue'
export default {
	name: 'Login',
	components: {
		'firebase-ui': FirebaseUi
	}
}
</script>
