<template lang="pug">
section.container 
	.row
		.col-md-12
			.form-group.mt-3
				input.form-control(v-model='query' type='text' placeholder='Search...')
	.row
		.col-md-12
			.card.mt-2(v-for='menu in filteredList' :key='menu.id')
				.card-body
					.row
						.col-md-4.col-lg-3
							img.card-img-top(v-if='menu.cover' :src='menu.cover')
						.col
							h5.card-title {{ menu.nama }}
							p.card-text {{ menu.deskripsi }}
							a.btn.btn-primary(v-if='menu.url' :href="menu.url") Lihat menu
							nuxt-link.btn.btn-primary(v-else :to="menu.nama.toLowerCase().split(' ').join('-')" tag='a') Lihat menu
				p(v-if='!filteredList.length') No results :(

</template>

<script>
import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl

const strapi = new Strapi(apiUrl)

const query = `
query {
	menus {
		_id
		nama
		deskripsi
		url
		cover {
			url
		}
	}
}
`;

export default {
//	layout: 'front',
	data: () => ({
		query: ''
	}),
	computed: {
		filteredList() {
			return this.menus.filter( menu => menu.nama.toLowerCase().includes(this.query.toLowerCase()))
		},
		menus() {
			return this.$store.getters['menus/list'].filter( menu => ['Indikator Mutu', 'SPM', 'IKS'].indexOf(menu.nama) >= 0)
		}
	},
	fetch: async ({ store }) => {
		store.commit('menus/emptyList')
		const { data: { menus } } = await strapi.request('post', '/graphql', {
			data: {
				query
			}
		})

		menus.forEach(menu => {
			store.commit('menus/add', menu)
		})
	},
}
</script>

<style>
@import	"@/node_modules/bootstrap/dist/css/bootstrap.css";
@import	"@/node_modules/bootstrap-vue/dist/bootstrap-vue.css";
</style>


<!--style lang="scss">
@import "~/node_modules/bootstrap/scss/_functions.scss";
$sizes: ();

@import "~/node_modules/bootstrap/scss/_variables.scss";
@import "~/node_modules/bootstrap/scss/_mixins.scss";
@import "~/node_modules/bootstrap/scss/_root.scss";
@import "~/node_modules/bootstrap/scss/_reboot.scss";
@import "~/node_modules/bootstrap/scss/_type.scss";
@import "~/node_modules/bootstrap/scss/_images.scss";
@import "~/node_modules/bootstrap/scss/_grid.scss";
@import "~/node_modules/bootstrap/scss/_forms.scss";
@import "~/node_modules/bootstrap/scss/_buttons.scss";
@import "~/node_modules/bootstrap/scss/_transitions.scss";
//@import "~/node_modules/bootstrap/scss/_navbar.scss";
@import "~/node_modules/bootstrap/scss/_card.scss";
@import "~/node_modules/bootstrap/scss/_media.scss";
//@import "~/node_modules/bootstrap/scss/_close.scss";
//@import "~/node_modules/bootstrap/scss/_modal.scss";
@import "~/node_modules/bootstrap/scss/_utilities.scss";
</style--!>
