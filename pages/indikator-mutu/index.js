import IndikatorMutuPage from '~/components/IndikatorMutuPage/index.vue'
import query from './query.graphql'

export default {
//	layout: 'front',
	components: {
		IndikatorMutuPage,
	},
	data: () => ({
		month: '',
		loaded: false,
	}),
	async beforeMounted() {
		this.loaded = true
		this.$nuxt.$loading.start()
		this.$toast.show('Mengambil data...')
		await fetch(this.$store)
		this.$nuxt.$loading.finish()
		this.loaded = false
		this.$toast.success('Selesai mengambil data...')
	},
	methods: {
		async updateMonth(val) {
			if(this.month !== val) {
				this.month = val
				this.loaded = true
				this.$nuxt.$loading.start()
				this.$toast.show('Mengambil data...')
				await this.$store.dispatch('mutus/fetch', { query, month: val })
				this.$toast.success('Selesai mengambil data...')
				this.$nuxt.$loading.finish()
				this.loaded = false
			}
		},
	},
};