import IndikatorMutuPage from '~/components/IndikatorMutuPage/index.vue'
import query from './query.graphql'
import queryRekap from './queryRekap.graphql'

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
		this.$toast.show('Mengambil data...')
		await this.$store.dispatch('data/fetchRekap', { query: queryRekap, periode: this.month })
		this.$toast.success('Selesai mengambil data...')
		this.$nuxt.$loading.finish()
		this.loaded = false
	},
	methods: {
		async updateMonth(val) {
			this.month = val
			this.loaded = true
			this.$nuxt.$loading.start()
			this.$toast.show('Mengambil data...')
			await this.$store.dispatch('data/fetchRekap', { query: queryRekap, periode: val })
			this.$toast.success('Selesai mengambil data...')
			this.$nuxt.$loading.finish()
			this.loaded = false
		},
	},

};