<template lang="pug">
b-container
	.row
		.col-md-12
			h3 Indikator Mutu
	.row
		.col-md-12
			b-button-toolbar(key-nav  aria-label="Toolbar with button groups")
				b-button-group.mx-1
					b-btn(:disabled='prev' variant='primary' @click='prevMonth') &lsaquo;
					b-btn(disabled variant='outline-primary' ) {{month}}
					b-btn(v-if='!sameOrAfter' :disabled='next' variant='primary' @click='nextMonth') &rsaquo;
				b-button-group.mx-1
					b-btn(v-if='blnHitung' :disabled='loaded' variant='primary' @click='goBlnHitung') bulan hitung
					b-btn(v-if='blnJalan' :disabled='loaded' variant='primary' @click='goBlnJalan') bulan berjalan
	.row
		.col-md-12
			.form-group.mt-3
				input.form-control(v-model='query' type='text' placeholder='Search...')
	.row
		.col-md-12
			b-table(
				show-empty
				hover 
				small
				responsive 
				:items="items"
				:fields="fields" 
				:current-page="currentPage" 
				:per-page="perPage" 
				:busy.sync='loaded' 
				:sort-by.sync="sortBy" 
				:sort-desc.sync="sortDesc" 
				:filter='query'
				@filtered='onFiltered'
			)
				template(slot='capaian' slot-scope='row')
					span.badge(:class='["badge", row.item.variant].join("-")') {{row.item.status}}
				template(slot="action" slot-scope="row")
					b-button-group.mx-1(size='sm')
						b-btn( size='sm' variant='outline-primary' @click.stop="row.toggleDetails" v-text='`${row.detailsShowing ? "Tutup":"Buka"} Input`')
						//-b-btn( size='sm' variant='outline-primary' @click.stop="info(row.item, row.index, $event.target)" ) Info
				template(slot="row-details" slot-scope="row")
					row-details(:row='row' :month='month' :loaded='loaded' @save='save')
	.row
		.col-md-12
			b-pagination(:total-rows="totalRows" :per-page="perPage" v-model="currentPage")
	//-b-modal#modalInfo(@hide='resetModal' :title='modalInfo.title' ok-only)
		pre {{modalInfo.content}}

</template>

<script>
import RowDetails from '~/components/RowDetails.vue'

import queryRekap from '../schema/queryRekap.graphql'
import query from '../schema/query.graphql'

export default {
	components: {
		RowDetails
	},
	data: () => ({
		month: '',
		loaded: false,
		sortBy: null,
		sortDesc: false,
		query: null,
		perPage: 10,
		currentPage: 1,
		totalRows: 0,
		modalInfo: { title: '', content: '' }

	}),
	fetch: async ({store}) => await store.dispatch('data/fetch', {
			query,
			name: 'mutu'
	}),
	async created(){
		this.month = this.$moment().locale('id').add(-1, 'month').format('MMMM YYYY')
		await this.updateMonth(this.month)
	},
	methods: {
		goBlnJalan() {
			this.month = this.$moment().format('MMMM YYYY')
		},
		goBlnHitung() {
			this.month = this.$moment().subtract(1, 'month').format('MMMM YYYY')
		},
		prevMonth() {
			this.month = this.$moment(this.month, 'MMMM YYYY').subtract(1, 'month').format('MMMM YYYY')
		},
		nextMonth() {
			this.month = this.$moment(this.month, 'MMMM YYYY').add(1, 'month').format('MMMM YYYY')
		},
		async updateMonth(val) {
			this.loaded = true
			await this.$store.dispatch('data/fetchRekap', { query: queryRekap, periode: this.month })
			await this.mutus.map( async mutu => {
				if(mutu.pembilang && mutu.penyebut) {
					let pembilang = {
						id: mutu.pembilang._id,
						from: mutu.from,
						to: mutu.to
					}
					let penyebut = {
						id: mutu.penyebut._id,
						from: mutu.from,
						to: mutu.to
					}
					await this.$store.dispatch('harian/counterTimeName', { pembilang, penyebut })
				}
			})
			this.loaded = false
		},
		onFiltered(filteredItems) {
			this.totalRows = filteredItems.length
			this.currentPage = 1
		},
		save(val){
			this.loaded = val
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
		},
		month(val) {
			this.updateMonth(val)
		}
	},
	computed: {
		prev() {
			return this.loaded
		},
		sameOrAfter(){
			return this.$moment(this.month, 'MMMM YYYY').isSameOrAfter(this.$moment()) 
		},
		next() {
			return this.loaded || this.sameOrAfter
		},
		blnJalan() {
			return this.month !== this.$moment().format('MMMM YYYY')
		},
		blnHitung() {
			return this.month !== this.$moment().subtract(1, 'month').format('MMMM YYYY')
		},
		fields: () => ['bagian', 'indikator', 'capaian', 'action'].map(e => ({
			key: e,
			sortable: ['bagian', 'indikator'].indexOf(e) > -1
		})),
		startOfMonth(){
			return this.$moment(this.month, 'MMMM YYYY').startOf("month");
		},
		endOfMonth(){
			return this.$moment(this.month, 'MMMM YYYY').endOf("month");
		},
		hariKerja(){
			let day = this.startOfMonth;
			let hk = 0
			while (day <= this.endOfMonth) {
				if(day.format('dddd') !== 'Minggu') {
					hk++
				}
				day = day.clone().add(1, "d");
			}
			return hk
		},
		days(){
			let days = []
			let day = this.startOfMonth;
			while (day <= this.endOfMonth) {
				let dayObj = {
					isActive: day.format('MMMM YYYY') === this.month && day.format('dddd') !== 'Minggu' && day.isSameOrBefore(this.$moment()),
					id: days.length,
					hari: day.format('dddd'),
					tanggal: day.format('DD-MM-YYYY'),
					week: day.format('w'),
					_rowVariant: day.format('dddd') === 'Minggu' ? 'danger' : undefined
				}
				days[days.length] = dayObj
				day = day.clone().add(1, "d");
			}
			return days
		},
		from(){
			return this.$moment(this.month, 'MMMM YYYY').toISOString()
		},
		to(){
			return this.$moment(this.month, 'MMMM YYYY').add(1, 'month').toISOString()
		},
		items() {
			return this.mutus.map( mutu => ({
				...mutu,
				days: this.days,
				pembilang:{
					...mutu.pembilang,
					jumlah: mutu.pembilang ? this.$store.getters['harian/getbln']({
						name: mutu.pembilang.name,
						bulan: this.month
					}) : 0
				},
				penyebut: {
					...mutu.penyebut,
					jumlah: mutu.penyebut && mutu.penyebut.name == Number(mutu.penyebut.name) 
					? Number(mutu.penyebut.name) 
					: mutu.penyebut && mutu.penyebut.name.includes('hari') || mutu.penyebut && mutu.penyebut.name.includes('visit') 
					? this.hariKerja 
					: (mutu.penyebut ? this.$store.getters['harian/getbln']({
						name: mutu.penyebut.name,
						bulan: this.month
					}) : 0)
				}

			}))
		},
		mutus() {
			return this.$store.getters['data/mutus'].map(mutu => ({
				...mutu,
				counternames: undefined,
				hariKerja: this.hariKerja,
				from: this.from,
				to: this.to,
				month: this.month,
				rekap: mutu.rekaps.length ? mutu.rekaps.filter(rekapId=>this.$store.getters['data/rekap'](rekapId).periode === this.month).map(rekapId=>this.$store.getters['data/rekap'](rekapId))[0] : null,
			})).map( mutu => ({
				...mutu,
				rekaps: undefined,
				status: mutu.rekap ? (mutu.operator === '>=' ? (mutu.rekap.jumlah >= mutu.numtarget ? 'Tercapai' : 'Belum tercapai') : (mutu.rekap.jumlah <= mutu.numtarget ? 'Tercapai' : 'Belum tercapai')) : 'Belum diinput',
				variant: mutu.rekap ? (mutu.operator === '>=' ? (mutu.rekap.jumlah >= mutu.numtarget ? 'success' : 'danger') : (mutu.rekap.jumlah <= mutu.numtarget ? 'success' : 'danger')) : 'warning',
				_showDetails: mutu._showDetails || false,
				harianApplied: mutu.penyebut ? (mutu.penyebut.name.includes('hari') || mutu.penyebut.name.includes('pasien') || mutu.penyebut.name.includes('visite')) : false ,
			}))
		}
	}

};
</script>

