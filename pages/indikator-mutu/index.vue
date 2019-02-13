<template lang="pug">
	indikator-mutu-page(:month='month' :loaded='loaded' @updateMonth='updateMonth')
</template>

<script>
import IndikatorMutuPage from '~/components/IndikatorMutuPage.vue'
import queryRekap from './queryRekap.graphql'
import query from './query.graphql'

export default {
	components: {
		IndikatorMutuPage,
	},
	data: () => ({
		month: '',
		loaded: false,
	}),
	async fetch({store}) {
		await store.dispatch('data/fetch', {
			query,
			name: 'mutu'
		})
	},
	async beforeMounted(){
		this.month = this.$moment().format('MMMM YYYY')
		this.loaded = true
		this.$nuxt.$loading.start()
		//this.$toast.show('Mengambil data...')
		await this.$store.dispatch('data/fetchRekap', { query: queryRekap, periode: this.month })
		//this.$toast.success('Selesai mengambil data...')
		this.$nuxt.$loading.finish()
		this.loaded = false
	},
	methods: {
		async updateMonth(val) {
			this.month = val
			this.loaded = true
			this.$nuxt.$loading.start()
			//this.$toast.show('Mengambil data...')
			await this.$store.dispatch('data/fetchRekap', { query: queryRekap, periode: val })
			//this.$toast.success('Selesai mengambil data...')
			this.$nuxt.$loading.finish()
			this.loaded = false
		},
	},

};
</script>

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
@import "~/node_modules/bootstrap/scss/_utilities.scss";

</style--!>
