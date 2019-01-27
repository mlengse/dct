import MonthPicker from '~/components/MonthPicker/index.vue'
import fetch from '~/assets/fetch'

export default {
	components: {
		MonthPicker
	},
	data: () => ({
		month: '',
		sortBy: null,
		sortDesc: false,
		query: null,
		perPage: 10,
		currentPage: 1,
		loaded: false,
		totalRows: 0,
		modalInfo: { title: '', content: '' }
	}),
	async beforeMounted() {
		this.loaded = true
		this.$nuxt.$loading.start()
		await fetch(this.$store, val)
		this.$nuxt.$loading.finish()
		this.loaded = false
	},
	methods: {
		onFiltered(filteredItems) {
			this.totalRows = filteredItems.length
			this.currentPage = 1
		},
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
		showing(row) {
			return row._showDetails
		},
		info(item, index, button) {
			this.modalInfo.title = `Row index: ${index}`
			this.modalInfo.content = JSON.stringify(item, null, 2)
			this.$root.$emit('bv::show::modal', 'modalInfo', button)
		},
		resetModal() {
			this.modalInfo.title = ''
			this.modalInfo.content = ''
		}
	},
	watch: {
		mutus(val) {
			this.totalRows = val.length
		}
	},
	computed: {
		fields: () => ['bagian', 'indikator', 'capaian', 'action'].map(e => ({ 
			key: e,
			sortable: true
		})),
		mutus() {
			return JSON.parse(JSON.stringify(this.$store.getters['mutus/list'].map(mutu => Object.assign(mutu, {
				capaian: mutu.rekap ? (mutu.operator === '>=' ? (mutu.rekap.jumlah >= mutu.numtarget ? 'Tercapai' : 'Belum tercapai') : (mutu.rekap.jumlah <= mutu.numtarget ? 'Tercapai' : 'Belum tercapai')) : 'Belum diinput',
				variant: mutu.rekap ? (mutu.operator === '>=' ? (mutu.rekap.jumlah >= mutu.numtarget ? 'success' : 'danger') : (mutu.rekap.jumlah <= mutu.numtarget ? 'success' : 'danger')) : 'warning',
				_showDetails: false,
			}))))

		}
	}
};