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
						.col-sm-5.col-md-4.col-lg-3
							img.card-img-top(v-if='menu.cover' :src='menu.cover')
						.col
							h5.mt-2.card-title {{ menu.nama }}
							p.card-text {{ menu.deskripsi }}
							a.btn.btn-primary(v-if='menu.url' :href="menu.url") Lihat menu
							nuxt-link.btn.btn-primary(v-else :to="menu.nama.toLowerCase().split(' ').join('-')" tag='a') Lihat menu
				p(v-if='!filteredList.length') No results :(

</template>

<script>
export default {
	data: () => ({
		query: ''
	}),
	computed: {
		filteredList() {
			return this.menus.filter( menu => menu.nama.toLowerCase().includes(this.query.toLowerCase()))
		},
		menus() {
			return this.$store.getters['list']
		}
	},
}
</script>
