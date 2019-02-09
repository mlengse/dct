<template lang="pug">
section.container
	.columns(v-if='account' v-cloak)
		.one-half.column.centered
			.blankslate.blankslate-clean-background
				.profile-image.centered(v-if='account.image')
					a.d-inline-block(:href="account.image" target="_blank" title="Click To View")
						img(:src="account.image" width="100" height="100" :alt="imageAlt")
				h3(v-text="account.displayName")
	.columns
		.one-half.column.centered
			div(v-if="account" v-cloak)
				p 
					| Information pulled from the firebase 
					code /account 
					| dataset
				pre(v-text="`${JSON.stringify(account, null, 2)}`")
		.mt-4.one-half.column.centered
			button.btn.btn-danger(type="button" @click="signOut") Sign Out
	//-
		.one-half.column.centered(v-if="editing" v-cloak)
			p Edit Your Profile
			EditAccountForm
		.one-half.column.centered(v-else)
			div(v-if="account" v-cloak)
				p 
					| Information pulled from the firebase 
					code /account
					| dataset
				pre(v-text="`${JSON.stringify(account, null, 2)}`")
		.mt-4.one-half.column.centered
			button.btn.btn-primary.mr-2(type="button" @click="toggleEditForm")
				span(v-if="editing") Done
				span(v-else) Edit
			button.btn.btn-danger(type="button" @click="signOut") Sign Out
	//
</template>

<script>
//import { mapState } from 'vuex'
//import EditAccountForm from '~/components/account/EditAccountForm.vue'

export default {
	// middleware: 'authenticated', // checking if auth'd with firebase kinda sucks as the middleware is triggered before firebase is ready
	components: {
	//	EditAccountForm
	},
	computed: {

		user() {
			return this.$store.state.users.user
		},
		account() {
			return this.$store.state.users.account
		},
/*
		...mapState([
			'user',
			'account'
		]),
*/
	imageAlt () {
			return `Profile image for ${this.account.displayName}`
		}
	},
//	data () {
		//return {
		//	editing: false
	//	}
//	},
	methods: {
	//	toggleEditForm () {
		//	this.editing = !this.editing
	//	},
		signOut () {
			this.$store.dispatch('users/userLogout')
				.then(() => {
//					this.$router.go(-1)
					this.$router.push('/')
//					this.$router.push('/account/login')
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
