<template lang="pug">
div
	nav.navbar.navbar-expand-lg.navbar-light.bg-light(role="navigation" aria-label="main navigation")
		section.container
			.navbar-collapse.collapse.w-100.order-1.order-md-0.dual-collapse2
				ul.navbar-nav.mr-auto
			.mx-auto.order-0
				nuxt-link.mx-auto.order-0.navbar-brand(to='/' exact) Puskesmas Sibela
			.navbar-collapse.collapse.w-100.order-3.dual-collapse2
				.navbar-nav.ml-auto
					nuxt-link.navbar-item(v-if="user" to="/account" v-text='user.email') 
					nuxt-link.navbar-item(v-else to="/account/login") 
						b-btn(variant='outline-success' size='sm') Masuk
	nuxt
</template>

<script>
export default {
	computed: {
		user(){
			return this.$store.state.users.user //getters['users/user']
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
//@import "~/node_modules/bootstrap/scss/_button-group.scss";
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
//@import "~/node_modules/bootstrap/scss/_close.scss";
//@import "~/node_modules/bootstrap/scss/_toasts.scss";
//@import "~/node_modules/bootstrap/scss/_modal.scss";
//@import "~/node_modules/bootstrap/scss/_tooltip.scss";
//@import "~/node_modules/bootstrap/scss/_popover.scss";
//@import "~/node_modules/bootstrap/scss/_carousel.scss";
//@import "~/node_modules/bootstrap/scss/_spinners.scss";
@import "~/node_modules/bootstrap/scss/_utilities.scss";
//@import "~/node_modules/bootstrap/scss/_print.scss";
</style>