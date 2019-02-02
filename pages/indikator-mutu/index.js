import IndikatorMutuPage from '~/components/IndikatorMutuPage/index.vue'
import fetch from '~/assets/fetch'

export default {
	layout: 'front',
	components: {
		'indikator-mutu': IndikatorMutuPage,
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
				await fetch(this.$store, val)
				this.$nuxt.$loading.finish()
				this.loaded = false
			}
		},
	},
};