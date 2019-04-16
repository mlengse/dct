<template lang="pug">
section.container
	.columns(v-if='user' v-cloak)
		.one-half.column.centered
			.blankslate.blankslate-clean-background
				.profile-image.centered(v-if='user.photoURL')
					a.d-inline-block(:href="user.photoURL" target="_blank" title="Click To View")
						img(:src="user.photoURL" width="100" height="100" :alt="imageAlt")
				h3(v-text="user.displayName || user.phoneNumber")
	.columns
		.mt-4.one-half.column.centered
			button.btn.btn-danger(type="button" @click="signOut") Sign Out
</template>

<script>
export default {
	computed: {
		user() {
			return this.$store.getters['users/user']
		},
		account() {
			return this.$store.getters['users/account']
		},
		imageAlt () {
			return `Profile image for ${this.user.displayName}`
		}
	},
	methods: {
		signOut () {
			this.$store.dispatch('users/userLogout')
				.then(() => {
					this.$router.go(0)
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}
}
</script>

<style lang="css" scoped>
	.profile-image img {
		border-radius: 100px;
		overflow: hidden;
		border: 2px solid #b2b1b0;
	}
	pre {
		white-space: pre-wrap;
	}
</style>
