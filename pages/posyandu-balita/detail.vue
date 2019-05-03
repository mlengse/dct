<template lang="pug">
section.container
	.row.mt-2
		nuxt-link.btn(to="/posyandu-balita" tag='button')
			h3 Posyandu Balita 
	.row
		h5.col(v-if = "posyandu && posyandu.name !== ''" ) {{ posyandu.name }} RW {{ posyandu.rw }}
	b-card.row.mt-2(no-body)
		b-tabs(card)
			b-tab.mt-2(title='Input')
				input-balita
			//b-tab.mt-2(title='Rekap')
			//b-tab.mt-2(title='Grafik')
</template>
<script>
export default {
	components: {
		InputBalita: () => import('~/components/InputBalita.vue'),
		BCard: () => import('~/node_modules/bootstrap-vue/es/components/card/card'),
		BTabs: () => import('~/node_modules/bootstrap-vue/es/components/tabs/tabs'),
		BTab: () => import('~/node_modules/bootstrap-vue/es/components/tabs/tab'),
	},

	computed: {
		posyandu(){
			return {
				_key: this.$route.query._key,
				name: this.$route.query.name,
				rw: this.$route.query.rw
			}
		},
	},

}
</script>
