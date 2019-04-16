<template lang="pug">
div
	nav.navbar.navbar-expand-lg.navbar-light.bg-light(role="navigation" aria-label="main navigation")
		section.container
			nuxt-link.navbar-brand( to='/') Puskesmas Sibela
			.navbar-right 
				button.btn.btn-outline-primary.btn-sm(type='button' v-if='user' v-b-modal="'pre'") {{user.email || user.phoneNumber }}
				button.btn.btn-outline-success.btn-sm(v-else @click='openLogin') Masuk
	b-modal#pre(hide-header hide-footer)
		account
	b-modal#login(hide-header hide-footer v-model="loginShow")
		login(@close='closeLogin')
	nuxt
</template>

<script>
import vBModal from '~/node_modules/bootstrap-vue/es/directives/modal/modal.js'
export default {
	components: {
		Login: () => import('~/components/Login.vue'),
		Account: () => import('~/components/Account.vue'),
		'b-modal': () => import("~/node_modules/bootstrap-vue/es/components/modal/modal.js")
	},
	directives: {
		'b-modal': vBModal
	},
	data: () => ({
		loginShow: false
	}),
	methods: {
		closeLogin() {
			this.$store.commit('users/closeLogin')
		},
		openLogin() {
			this.$store.commit('users/openLogin')
		},
	},
	watch: {
		login: function(val) {
			this.loginShow = val
		},
		loginShow: function(val) {
			this.$store.commit('users/toggleLogin', val)
		}
	},
	computed: {
		login(){
			return this.$store.getters['users/login']
		},
		user(){
			return this.$store.getters['users/user']
		}
	}
}
</script>