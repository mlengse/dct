<template lang="pug">
div
	nav.navbar.navbar-expand-lg.navbar-light.bg-light
		b-container(fluid)
			nuxt-link.navbar-brand( tag='a' to='/' exact) Puskesmas Sibela
			.navbar-right 
				b-button-group(v-if='user')
					b-btn(variant='primary' v-b-modal.pre) rinci
					b-btn(variant='outline-danger' @click='gotologout') Keluar
				b-btn(v-else variant='outline-success' @click='toggleLogin') Masuk
	b-modal#pre(hide-header hide-footer)
		b-card.mb-2(:title='name' :img-src='photo' :img-alt='name')
			p.card-text {{email}}
	b-modal#login(hide-header hide-footer v-model="loginShow")
		.login
			no-ssr
				firebase-ui(@closeLogin='toggleLogin' :logout='logout')
</template>

<script>
import FirebaseUi from '~/components/FirebaseUi.vue'
export default {
	name: 'Login',
	components: {
		'firebase-ui': FirebaseUi
	},
	data: () => ({
		loginShow: false,
		logout: true,
	}),
	methods: {
		toggleLogin(){
			this.loginShow = !this.loginShow
			this.$nuxt.$loading.start()
      this.$toast.show('Anda akan login')

		},
		gotologout(){
			this.logout = !this.logout
		}
	},
	computed: {
		name(){
			return this.user.displayName
		},
		email(){
			return this.user.email
		},
		photo(){
			return this.user.photoURL
		},
		userId(){
			return this.user.uid
		},
		user(){
			return this.$store.getters['users/getUser']
		}
	}
}
</script>

<style lang="scss">
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
@import "~/node_modules/bootstrap/scss/_card.scss";
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
</style>

