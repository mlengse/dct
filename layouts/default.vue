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

<!--style lang="scss">
@import "~/node_modules/bootstrap/scss/_functions.scss";
$sizes: ();

@import "~/node_modules/bootstrap/scss/_variables.scss";
@import "~/node_modules/bootstrap/scss/_mixins.scss";
@import "~/node_modules/bootstrap/scss/_root.scss";
@import "~/node_modules/bootstrap/scss/_reboot.scss";
@import "~/node_modules/bootstrap/scss/_type.scss";
//@import "~/node_modules/bootstrap/scss/_images.scss";
//@import "~/node_modules/bootstrap/scss/_code.scss";
@import "~/node_modules/bootstrap/scss/_grid.scss";
//@import "~/node_modules/bootstrap/scss/_tables.scss";
//@import "~/node_modules/bootstrap/scss/_forms.scss";
@import "~/node_modules/bootstrap/scss/_buttons.scss";
@import "~/node_modules/bootstrap/scss/_transitions.scss";
//@import "~/node_modules/bootstrap/scss/_dropdown.scss";
@import "~/node_modules/bootstrap/scss/_button-group.scss";
//@import "~/node_modules/bootstrap/scss/_input-group.scss";
//@import "~/node_modules/bootstrap/scss/_custom-forms.scss";
//@import "~/node_modules/bootstrap/scss/_nav.scss";
@import "~/node_modules/bootstrap/scss/_navbar.scss";
//@import "~/node_modules/bootstrap/scss/_card.scss";
//@import "~/node_modules/bootstrap/scss/_breadcrumb.scss";
//@import "~/node_modules/bootstrap/scss/_pagination.scss";
//@import "~/node_modules/bootstrap/scss/_badge.scss";
//@import "~/node_modules/bootstrap/scss/_jumbotron.scss";
//@import "~/node_modules/bootstrap/scss/_alert.scss";
//@import "~/node_modules/bootstrap/scss/_progress.scss";
//@import "~/node_modules/bootstrap/scss/_media.scss";
//@import "~/node_modules/bootstrap/scss/_list-group.scss";
@import "~/node_modules/bootstrap/scss/_close.scss";
//@import "~/node_modules/bootstrap/scss/_toasts.scss";
@import "~/node_modules/bootstrap/scss/_modal.scss";
//@import "~/node_modules/bootstrap/scss/_tooltip.scss";
//@import "~/node_modules/bootstrap/scss/_popover.scss";
//@import "~/node_modules/bootstrap/scss/_carousel.scss";
//@import "~/node_modules/bootstrap/scss/_spinners.scss";
@import "~/node_modules/bootstrap/scss/_utilities.scss";
//@import "~/node_modules/bootstrap/scss/_print.scss";
</style--!>