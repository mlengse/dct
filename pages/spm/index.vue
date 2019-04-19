<template lang="pug">
section.container 
	.row.mt-2
		h3.col Capaian Indikator SPM
	.row.mt-2
		.col.mt-2
			b-input-group(prepend='Bagian' size='sm')
				b-form-select(v-model='bagianSelected' :options='bagian' size='sm')
		.col-md-3.mt-2
			b-input-group(prepend='Bulan' size='sm')
				b-form-select(v-model='bulanSelected' :options='bulan' size='sm')
		.col-md-3.mt-2
			b-input-group(prepend='Tahun' size='sm')
				b-form-select(v-model='tahunSelected' :options='tahun' size='sm')
		.col.mt-2
			download-excel.mr-2(:data="items" :loaded='loaded' :fields='json_fields' :name='"spm-" + bulanSelected + "-" + tahunSelected + ".xlsx"' label='Download SPM') 
	.row.mt-2
		.col-md-12
			b-pagination(:total-rows="totalRows" :per-page="perPage" v-model="currentPage")
	.row.mt-2
	.table-responsive
		b-table#tabel(
			stacked='sm' 
			hover 
			selectable
			select-mode='single'
			@row-selected='rowSelected'
			:current-page="currentPage" 
			:per-page="perPage" 
			:filter='filter' 
			@filtered='onFiltered'
			:fields='fields' 
			:busy.sync='loaded' 
			:items="items" 	
		)
			template(slot='hasil' slot-scope='row')
				span(:class='["text", row.item.masalah ? "danger": "success"].join("-")') {{row.item.hasil}}
</template>

<script>
export default {
	components: {
		bInputGroup: () => import('~/node_modules/bootstrap-vue/es/components/input-group/input-group'),
		bFormSelect: () => import('~/node_modules/bootstrap-vue/es/components/form-select/form-select'),
		DownloadExcel: () => import('~/components/DownloadExcel.vue'),
		BPagination: () => import('~/node_modules/bootstrap-vue/es/components/pagination/pagination'),
		BTable: () => import('~/node_modules/bootstrap-vue/es/components/table/table'),
	},
	data: () => ({
		loaded: false,
		bagianSelected: 'Semua',
		bulanSelected: '',
		tahunSelected: '',
		perPage: 10,
		currentPage: 1,
		totalRows: 0,
		pastRow: {
			_showDetails: false
		}
	}),
	async beforeMount(){
		this.bulanSelected = this.$moment().locale('id').add(-1, 'month').format('MMMM')
		this.tahunSelected = this.$moment().format('YYYY')
		await this.$nextTick( async () => {
      this.$nuxt.$loading.start()
			this.loaded = true
			await this.$store.dispatch('spm/all', this.$moment().locale('id').add(-1, 'month').format('MM'))
			this.$nuxt.$loading.finish()
			this.loaded = false
      this.$nuxt.$loading.finish()
    })
	},
	watch: {
		async bulanSelected( val ){
			await this.$store.dispatch('spm/all', this.blnNum)
		},
		items(val) {
			this.totalRows = val.length
		},
	},
	methods: {
		rowSelected(item){
			this.$router.push({ path: "spm/details", query: { id: item[0].kode , tahun: this.tahun} })
		},
		getFixed(numb) {
			let num = Number(numb);
			if(!numb) return '0';
			if(!num) return numb;
			if(num%1 == 0) return num;
			if(num.toFixed(1).toString() > '0.1') return num.toFixed(1);
			if(num.toFixed(2).toString() > '0.01') return num.toFixed(2);
			if(num.toFixed(3).toString() > '0.001') return num.toFixed(3);
			if(num.toFixed(4).toString() > '0.0001') return num.toFixed(4);
		},
		onFiltered(filteredItems) {
			this.totalRows = filteredItems.length
			this.currentPage = 1
		},

	},
	computed: {
		json_fields(){
			let a ={}
			Object.keys(this.fields).map( e => {
				a[e] = e
			}) 
			return a
		},
		filter(){
			if(this.bagianSelected === 'Semua') return null
			return this.bagianSelected
		},
		fields(){
			let tt = ['bagian', 'indikator', 'target tahunan', 'target bulanan', 'pembilang', 'penyebut', 'hasil']
			let a = {}
			tt.map( e =>{
				a[e] = {
				}
			})
			return a
		},
		tahun(){
			return [ this.$moment().format('YYYY') ]
		},
		bulan(){
			let moment = this.$moment
			return Array.apply(0, Array(12)).map(function(_,i){
				return moment().month(i).format('MMMM')
			})
		},
		bagian(){
			return this.$store.getters['spm/bagian']
		},
		blnNum(){
			return this.$moment(this.bulanSelected, 'MMMM').format('MM')
		},
		items(){
			return this.$store.getters['spm/spmList'].map( e => Object.assign({}, e, {
				'target tahunan': this.getFixed(e['target tahunan']),
				'target bulanan': this.getFixed(e['target bulanan']),
				'pembilang': this.getFixed(e.pembilang),
				'penyebut': this.getFixed(e.penyebut),
				'hasil': this.getFixed(e.hasil),
				'satuan': e.satuan == 'persen' || e.satuan == 'Persen' ? '%' : e.satuan,
				_showDetails: false,
			}))
		}
	}
}
</script>
