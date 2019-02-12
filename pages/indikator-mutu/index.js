import IndikatorMutuPage from '~/components/IndikatorMutuPage/index.vue'
import queryRekap from './queryRekap.graphql'

const query = `query States($name: String!){
  states(where: { name: $name }) {
    _id
    name
    indicators(where: { active: true }) {
      _id
      bagian {
        nama
      }
      name
      counternames {
        _id
        name
        countertype {
          name
        }
        counters {
          _id
        }
      }
      operator {
        name
      }
      target
      satuan {
        name
      }
    }
  }
}
`

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