<template lang="pug">
div
	nav.navbar.navbar-expand-lg.navbar-light.bg-light(role="navigation" aria-label="main navigation")
		section.container
			nuxt-link.navbar-brand( to='/' exact) Puskesmas Sibela
			.navbar-right 
				//b-button-group(v-if='user')
				button.btn.btn-outline-primary.btn-sm(type='button' v-if='user' v-b-modal.pre) {{user.email || user.phoneNumber}}
					//b-btn(variant='outline-danger' @click='gotologout') Keluar
				button.btn.btn-outline-success.btn-sm(v-else @click='openLogin') Masuk
	b-modal#pre(hide-header hide-footer)
		account
	b-modal#login(hide-header hide-footer v-model="loginShow")
		login(@close='closeLogin')
	nuxt
</template>

<script>
import Login from '~/components/Login.vue'
import Account from '~/components/Account.vue'
import BModal from "~/node_modules/bootstrap-vue/es/components/modal/modal.js";
import vBModal from '~/node_modules/bootstrap-vue/es/directives/modal/modal.js'
export default {
	components: {
		Login,
		Account,
		'b-modal': BModal
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
			return this.$store.state.users.user //getters['users/user']
		}
	}
}
</script>