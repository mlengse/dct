<template lang="pug">
section.container
	.row.mt-2
		.col-md-12
			h3 Indikator Mutu
	.row
		.col-md-12
			.btn-group.mt-2.mr-2
				button.btn.btn-sm.btn-primary(type='button' :disabled='prev' @click='prevMonth') &lsaquo;
				button.btn.btn-sm.btn-outline-primary(type='button' disabled ) {{month}}
				button.btn.btn-sm.btn-primary(type='button' v-if='!sameOrAfter' :disabled='next' @click='nextMonth') &rsaquo;
			.btn-group.mt-2.mr-2
				button.btn.btn-sm.btn-primary(type='button' v-if='blnHitung' :disabled='loaded' @click='goBlnHitung') bulan hitung
				button.btn.btn-sm.btn-primary(type='button' v-if='blnJalan' :disabled='loaded' @click='goBlnJalan') bulan berjalan
			.btn-group.mt-2.mr-2
				download-excel(:data="dl_items" :loaded='loaded' :fields='json_fields' :name='"indikator-mutu-" + month + ".xlsx"' label='Download Indikator') 
	.row.mt-2
		.col-md-12
			.form-group.mt-2
				input.form-control(v-model='query' type='text' placeholder='Search...')
	.row.mt-2
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
				template(slot='status' slot-scope='row')
					span.badge(:class='["badge", row.item.variant].join("-")') {{row.item.status}}
				template(slot="action" slot-scope="row")
					.btn-group.mx-1(size='sm')
						button.btn.btn-sm.btn-outline-primary(type='button' @click.stop="row.toggleDetails" v-text='`${row.detailsShowing ? "Tutup":"Buka"} Input`')
						//b-btn( size='sm' variant='outline-primary' @click.stop="info(row.item, row.index, $event.target)" ) Info
				template(slot="row-details" slot-scope="row")
					row-details(:row='row' :month='month' :loaded='loaded' @save='save' @updateMonth='updateMonth')
	.row.mt-2
		.col-md-12
			b-pagination(:total-rows="totalRows" :per-page="perPage" v-model="currentPage")
	b-modal#modalInfo(@hide='resetModal' :title='modalInfo.title' ok-only)
		pre {{modalInfo.content}}

</template>

<script>

import RowDetails from '~/components/RowDetails.vue'
import DownloadExcel from '~/components/DownloadExcel.vue'
import BTable from '~/node_modules/bootstrap-vue/es/components/table/table'
import BPagination from '~/node_modules/bootstrap-vue/es/components/pagination/pagination'
import BModal from '~/node_modules/bootstrap-vue/es/components/modal/modal'
import vBModal from '~/node_modules/bootstrap-vue/es/directives/modal/modal'

import queryRekap from '../schema/queryRekap.graphql'
import query from '../schema/query.graphql'

export default {
	components: {
		RowDetails,
		DownloadExcel,
		BTable,
		BPagination,
		'b-modal': BModal
	},
	directives: {
		'b-modal': vBModal
	},
	data: () => ({
		json_fields:{
			'Bagian': 'bagian',
			'Indikator': 'indikator',
			'Definisi Pembilang': 'pembilangname',
			'Definisi Penyebut': 'penyebutname',
			'Target': 'target',
			'Capaian': 'capaian',
			'Pembilang': 'pembilang',
			'Penyebut': 'penyebut',
			'Masalah': 'masalah',
			'Rencana Tindak Lanjut': 'rtl'
		},
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
	fetch: async ({store}) => {
		await Promise.all([
			store.dispatch('data/fetch'),
			store.dispatch('data/createdMutu')
		])
	},
	async beforeMount() {
		await this.$nextTick( async () => {
			this.$nuxt.$loading.start()
			this.loaded = true
			this.month = this.$moment().locale('id').add(-1, 'month').format('MMMM YYYY')
			await this.$store.dispatch('data/createdMutu')
			this.loaded = false
			this.$nuxt.$loading.finish()
    })

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
			this.$nuxt.$loading.start()
			await this.$store.dispatch('data/createdMutu')
			this.$nuxt.$loading.finish()
			this.loaded = false
		},
		onFiltered(filteredItems) {
			this.totalRows = filteredItems.length
			this.currentPage = 1
		},
		async save({ rekap, pembilang, penyebut }){
			this.$nuxt.$loading.start()
			this.loaded = true
			await this.$store.dispatch('data/sendRekap', rekap)
			await this.$store.dispatch('data/sendCounter', pembilang)
			await this.$store.dispatch('data/sendCounter', penyebut)
			this.loaded = false
			this.$nuxt.$loading.finish()
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
		items(val) {
			this.totalRows = val.length
		},
		month(val) {
			this.updateMonth(val)
		}
	},
	computed: {
		dl_items(){
			return this.items.map( e => Object.assign({}, {
				bagian: e.bagian,
				indikator: e.indikator,
				target: e.target,
				capaian: e.rekap.jumlah,
				pembilang: e.pembilang.jumlah,
				penyebut: e.penyebut.jumlah,
				pembilangname: e.pembilang.name,
				penyebutname: e.penyebut.name

			}))
		},
		fields: () => ['bagian', 'indikator', 'status', 'action'].map(e => ({
			key: e,
			sortable: ['bagian', 'indikator', 'status'].indexOf(e) > -1
		})),
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
			return this.$store.getters['data/mutus'].map(mutu => Object.assign({}, mutu, {
				counternames: undefined,
				hariKerja: this.hariKerja,
				from: this.from,
				to: this.to,
				month: this.month,
				//days: this.days,
				pembilang: Object.assign({}, mutu.pembilang, {
					_id: undefined,
					jumlah: 0
				}, this.$store.getters['data/getbln']({
					name: mutu.pembilang.name,
					bulan: this.month
				}), {
					counternameId: mutu.pembilang._id
				}),
				penyebut: Object.assign({}, mutu.penyebut, {
					_id: undefined,
					jumlah: mutu.penyebut && mutu.penyebut.name == Number(mutu.penyebut.name) 
					? Number(mutu.penyebut.name) 
					: mutu.penyebut && mutu.penyebut.name.includes('hari') || mutu.penyebut && mutu.penyebut.name.includes('visit') 
					? this.hariKerja 
					: 0
					}, this.$store.getters['data/getbln']({
						name: mutu.penyebut.name,
						bulan: this.month
					}), {
						counternameId: mutu.penyebut._id
					}
				),
			})).map( mutu => Object.assign({}, mutu, {
				rekap: mutu.rekaps && mutu.rekaps.length 
				? Object.assign({
					jumlah: 0
				}, mutu.rekaps.filter( rekap => rekap.periode === this.month )[0]) 
				: {
					jumlah: 0
				},
				rekaps: undefined,
			})).map( mutu => Object.assign({}, mutu, {
				status: mutu.rekap 
				? (mutu.operator === '>=' 
					? (mutu.rekap.jumlah >= mutu.numtarget 
						? 'Tercapai' 
						: mutu.pembilang.jumlah > 0 
							? 'Belum tercapai' 
							: 'Belum diinput') 
					: mutu.penyebut.jumlah > 0 
						? mutu.rekap.jumlah <= mutu.numtarget 
							? 'Tercapai' 
							: 'Belum tercapai' 
						: 'Belum diinput') 
				: 'Belum diinput',
				_showDetails: mutu._showDetails || false,
				harianApplied: mutu.penyebut ? (mutu.penyebut.name.includes('hari') || mutu.penyebut.name.includes('pasien') || mutu.penyebut.name.includes('visite')) : false ,
			})).map( mutu => Object.assign({}, mutu, {
				variant: (() => {
					switch(mutu.status) {
						case 'Tercapai':
							return 'success' 
						case 'Belum tercapai':
							return 'danger'
						default:
							return 'warning'
					}
				})(),
				/*
				days: !mutu.harianApplied ? undefined : mutu.days.map( dayObj => Object.assign({}, dayObj, {
					pembilang: Object.assign({},  mutu.pembilang, {
						_id: undefined
					}, this.$store.getters['data/gettgl']({
						name: mutu.pembilang.name,
						tanggal: dayObj.tanggal
					}),  {
						jumlah: (() => {
							let j = 0
							let a = mutu.pembilang.counters.filter(counter=> !counter.isMonth && counter.tgl === dayObj.tanggal)
							a.length ? a[0] ? j =a[0].jumlah : '' : ''
							return j
						})(),
						counters: undefined,
					}),
					penyebut: Object.assign({}, mutu.penyebut, {
						_id: undefined
					}, {
						jumlah: (mutu.penyebut.name.includes('hari') || mutu.penyebut.name.includes('visit')) && this.$moment(dayObj.tanggal, 'DD-MM-YYYY').format('dddd') !== 'Minggu' ? 1 : 0,
						counters: undefined
					}, this.$store.getters['data/gettgl']({
						name: mutu.penyebut.name,
						tanggal: dayObj.tanggal
					}))
				})),
				*/
			})).map( mutu => Object.assign({}, mutu, {
				pembilang: Object.assign({}, mutu.pembilang, {
					counters: undefined
				}),
				penyebut: Object.assign({}, mutu.penyebut, {
					counters: undefined
				}),
			}))
		}
	}

};
</script>
<style>
@import	"@/node_modules/bootstrap/dist/css/bootstrap.css";
@import	"@/node_modules/bootstrap-vue/dist/bootstrap-vue.css";
</style>

