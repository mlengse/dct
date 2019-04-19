<template lang="pug">
section.container 
	.row.mt-2
		h3.col Indeks Keluarga Sehat Wilayah
	.row.mt-2
		.col-md-6.mt-2
			b-input-group(prepend='Kelurahan' size='sm')
				b-form-select(v-model='kelSelected' :options='kel' size='sm')
		.col-md-3.mt-2(v-if='kelSelected !== "Semua"')
			b-input-group(prepend='RW' size='sm')
				b-form-select(v-model='rwSelected' :options='rw' size='sm')
		.col-md-3.mt-2(v-if='rwSelected !== "Semua"')
			b-input-group(prepend='RT' size='sm')
				b-form-select(v-model='rtSelected' :options='rt' size='sm')
	.btn-toolbar
		download-excel.mr-2.mt-2(:data="items" :loaded='loaded' :fields="json_fields" :name='iksId + ".xlsx"' label='Download IKS') 
		download-excel.mr-2.mt-2(v-if='kelSelected === "MOJOSONGO"' :data="resume" :loaded='loaded' :fields="resume_fields" name='resume_pispk.xlsx' label='Download Resume Pelaksanaan') 
	no-ssr.card.mt-2
		.card-body
			.list-group
				.list-group-item
					.row
						.col IKS 
						.col(:class='["text", iksTotalAttr.variant].join("-")') {{iksTotal}}  
						.col-md-6
							span.badge(:class='["badge", iksTotalAttr.variant].join("-")') {{iksTotalAttr.text}}
				.list-group-item(v-if='kelSelected === "MOJOSONGO"')
					.row
						.col Jumlah Keluarga
						.col {{iks.jmlKK}}
						.col-md-6
							b-progress(:value="iks.jmlKK" :max="iks.jmlKK" variant='secondary')
				.list-group-item
					.row
						.col Jumlah Terindeks
						.col {{iks.jml}}
							span(v-if='kesenjangan && kelSelected === "MOJOSONGO"')  ({{kesenjangan}})
						.col-md-6
							b-progress(:value="iks.jml" :max="iks.jmlKK")
				.list-group-item
					.row
						.col Sehat
						.col {{iks.sehat}}
						.col-md-6
							b-progress(:value="iks.sehat" :max="iks.jml" variant='success')
				.list-group-item
					.row
						.col Pra Sehat
						.col {{iks.prasehat}}
						.col-md-6
							b-progress(:value="iks.prasehat" :max="iks.jml" variant='warning')
				.list-group-item
					.row
						.col Tidak Sehat
						.col {{iks.tdksehat}}
						.col-md-6
							b-progress(:value="iks.tdksehat" :max="iks.jml" variant='danger')
	.row.mt-2.fluid
		b-table(responsive :busy.sync='loaded' stacked='sm' striped hover :fields='fields' :items="items")
			template(slot='iks', slot-scope='row') 
				span(:class='`text-${getAttr(row.item.iks)}`') {{row.item.iks ? row.item.iks.toFixed(3) : 0 }}
			template(slot='ind', slot-scope='row') 
				p {{ row.item.ind }} 
				button.btn.btn-primary.btn-sm(v-if='["jiwa", "tb"].filter(e=> e === row.item.key).length' @click='byName(JSON.parse(JSON.stringify(row.item)))') by name

</template>
<script>
import getIKSgql from '~/apollo/queries/getIKS.gql'

export default {
	components: {
		bInputGroup: () => import('~/node_modules/bootstrap-vue/es/components/input-group/input-group'),
		bFormSelect: () => import('~/node_modules/bootstrap-vue/es/components/form-select/form-select'),
		bProgress: () => import('~/node_modules/bootstrap-vue/es/components/progress/progress'),
		DownloadExcel: () => import('~/components/DownloadExcel.vue'),
		BTable: () => import('~/node_modules/bootstrap-vue/es/components/table/table'),
	},
	data: () => ({
		indikator: [ "kb", "salinFaskes", "imun", "asi", "tumbuh", "tb", "ht", "jiwa", "rokok", "jkn", "ab",  "jamban",],
		nilai: ['y', 'penyebut', 'iks'],
  	jmlkk: [{"rw":1,"rt":1,"jmlKK":146},{"rw":1,"rt":2,"jmlKK":68},{"rw":1,"rt":3,"jmlKK":132},{"rw":1,"rt":4,"jmlKK":142},{"rw":1,"rt":"Semua","jmlKK":488},{"rw":2,"rt":1,"jmlKK":60},{"rw":2,"rt":2,"jmlKK":45},{"rw":2,"rt":3,"jmlKK":86},{"rw":2,"rt":4,"jmlKK":121},{"rw":2,"rt":5,"jmlKK":154},{"rw":2,"rt":"Semua","jmlKK":466},{"rw":3,"rt":1,"jmlKK":66},{"rw":3,"rt":2,"jmlKK":82},{"rw":3,"rt":3,"jmlKK":137},{"rw":3,"rt":4,"jmlKK":85},{"rw":3,"rt":5,"jmlKK":130},{"rw":3,"rt":6,"jmlKK":72},{"rw":3,"rt":"Semua","jmlKK":572},{"rw":4,"rt":1,"jmlKK":78},{"rw":4,"rt":2,"jmlKK":176},{"rw":4,"rt":3,"jmlKK":181},{"rw":4,"rt":4,"jmlKK":186},{"rw":4,"rt":5,"jmlKK":60},{"rw":4,"rt":"Semua","jmlKK":681},{"rw":5,"rt":1,"jmlKK":85},{"rw":5,"rt":2,"jmlKK":101},{"rw":5,"rt":3,"jmlKK":78},{"rw":5,"rt":4,"jmlKK":142},{"rw":5,"rt":"Semua","jmlKK":406},{"rw":6,"rt":1,"jmlKK":63},{"rw":6,"rt":2,"jmlKK":184},{"rw":6,"rt":3,"jmlKK":170},{"rw":6,"rt":4,"jmlKK":71},{"rw":6,"rt":5,"jmlKK":14},{"rw":6,"rt":6,"jmlKK":57},{"rw":6,"rt":7,"jmlKK":62},{"rw":6,"rt":"Semua","jmlKK":621},{"rw":7,"rt":1,"jmlKK":225},{"rw":7,"rt":2,"jmlKK":72},{"rw":7,"rt":3,"jmlKK":325},{"rw":7,"rt":4,"jmlKK":300},{"rw":7,"rt":5,"jmlKK":185},{"rw":7,"rt":6,"jmlKK":140},{"rw":7,"rt":7,"jmlKK":57},{"rw":7,"rt":8,"jmlKK":38},{"rw":7,"rt":9,"jmlKK":205},{"rw":7,"rt":"Semua","jmlKK":1547},{"rw":8,"rt":1,"jmlKK":52},{"rw":8,"rt":2,"jmlKK":73},{"rw":8,"rt":3,"jmlKK":78},{"rw":8,"rt":4,"jmlKK":59},{"rw":8,"rt":5,"jmlKK":109},{"rw":8,"rt":6,"jmlKK":72},{"rw":8,"rt":7,"jmlKK":61},{"rw":8,"rt":"Semua","jmlKK":504},{"rw":9,"rt":1,"jmlKK":48},{"rw":9,"rt":2,"jmlKK":70},{"rw":9,"rt":3,"jmlKK":72},{"rw":9,"rt":4,"jmlKK":184},{"rw":9,"rt":5,"jmlKK":201},{"rw":9,"rt":6,"jmlKK":107},{"rw":9,"rt":7,"jmlKK":58},{"rw":9,"rt":8,"jmlKK":158},{"rw":9,"rt":9,"jmlKK":35},{"rw":9,"rt":"Semua","jmlKK":933},{"rw":10,"rt":1,"jmlKK":43},{"rw":10,"rt":2,"jmlKK":76},{"rw":10,"rt":3,"jmlKK":47},{"rw":10,"rt":"Semua","jmlKK":166},{"rw":11,"rt":1,"jmlKK":111},{"rw":11,"rt":2,"jmlKK":74},{"rw":11,"rt":3,"jmlKK":169},{"rw":11,"rt":4,"jmlKK":69},{"rw":11,"rt":5,"jmlKK":102},{"rw":11,"rt":6,"jmlKK":89},{"rw":11,"rt":"Semua","jmlKK":614},{"rw":12,"rt":1,"jmlKK":133},{"rw":12,"rt":2,"jmlKK":99},{"rw":12,"rt":3,"jmlKK":86},{"rw":12,"rt":4,"jmlKK":104},{"rw":12,"rt":5,"jmlKK":153},{"rw":12,"rt":6,"jmlKK":208},{"rw":12,"rt":7,"jmlKK":50},{"rw":12,"rt":8,"jmlKK":106},{"rw":12,"rt":9,"jmlKK":41},{"rw":12,"rt":"Semua","jmlKK":980},{"rw":13,"rt":1,"jmlKK":76},{"rw":13,"rt":2,"jmlKK":44},{"rw":13,"rt":3,"jmlKK":68},{"rw":13,"rt":4,"jmlKK":39},{"rw":13,"rt":5,"jmlKK":49},{"rw":13,"rt":"Semua","jmlKK":276},{"rw":14,"rt":1,"jmlKK":70},{"rw":14,"rt":2,"jmlKK":95},{"rw":14,"rt":3,"jmlKK":52},{"rw":14,"rt":4,"jmlKK":55},{"rw":14,"rt":"Semua","jmlKK":272},{"rw":15,"rt":1,"jmlKK":51},{"rw":15,"rt":2,"jmlKK":64},{"rw":15,"rt":3,"jmlKK":61},{"rw":15,"rt":4,"jmlKK":34},{"rw":15,"rt":"Semua","jmlKK":210},{"rw":16,"rt":1,"jmlKK":62},{"rw":16,"rt":2,"jmlKK":61},{"rw":16,"rt":3,"jmlKK":78},{"rw":16,"rt":4,"jmlKK":57},{"rw":16,"rt":5,"jmlKK":80},{"rw":16,"rt":"Semua","jmlKK":338},{"rw":17,"rt":1,"jmlKK":89},{"rw":17,"rt":2,"jmlKK":71},{"rw":17,"rt":3,"jmlKK":58},{"rw":17,"rt":4,"jmlKK":54},{"rw":17,"rt":"Semua","jmlKK":272},{"rw":18,"rt":1,"jmlKK":64},{"rw":18,"rt":2,"jmlKK":54},{"rw":18,"rt":3,"jmlKK":34},{"rw":18,"rt":4,"jmlKK":60},{"rw":18,"rt":5,"jmlKK":65},{"rw":18,"rt":"Semua","jmlKK":277},{"rw":19,"rt":1,"jmlKK":86},{"rw":19,"rt":2,"jmlKK":57},{"rw":19,"rt":3,"jmlKK":62},{"rw":19,"rt":4,"jmlKK":72},{"rw":19,"rt":5,"jmlKK":109},{"rw":19,"rt":"Semua","jmlKK":386},{"rw":20,"rt":1,"jmlKK":""},{"rw":20,"rt":2,"jmlKK":55},{"rw":20,"rt":3,"jmlKK":70},{"rw":20,"rt":4,"jmlKK":77},{"rw":20,"rt":"Semua","jmlKK":202},{"rw":21,"rt":1,"jmlKK":78},{"rw":21,"rt":2,"jmlKK":67},{"rw":21,"rt":3,"jmlKK":67},{"rw":21,"rt":4,"jmlKK":51},{"rw":21,"rt":"Semua","jmlKK":263},{"rw":22,"rt":1,"jmlKK":53},{"rw":22,"rt":2,"jmlKK":43},{"rw":22,"rt":3,"jmlKK":70},{"rw":22,"rt":4,"jmlKK":59},{"rw":22,"rt":"Semua","jmlKK":225},{"rw":23,"rt":1,"jmlKK":39},{"rw":23,"rt":2,"jmlKK":60},{"rw":23,"rt":3,"jmlKK":66},{"rw":23,"rt":4,"jmlKK":62},{"rw":23,"rt":5,"jmlKK":65},{"rw":23,"rt":"Semua","jmlKK":292},{"rw":24,"rt":1,"jmlKK":36},{"rw":24,"rt":2,"jmlKK":78},{"rw":24,"rt":3,"jmlKK":64},{"rw":24,"rt":4,"jmlKK":60},{"rw":24,"rt":"Semua","jmlKK":238},{"rw":25,"rt":1,"jmlKK":49},{"rw":25,"rt":2,"jmlKK":49},{"rw":25,"rt":3,"jmlKK":60},{"rw":25,"rt":4,"jmlKK":55},{"rw":25,"rt":5,"jmlKK":62},{"rw":25,"rt":6,"jmlKK":20},{"rw":25,"rt":"Semua","jmlKK":295},{"rw":26,"rt":1,"jmlKK":55},{"rw":26,"rt":2,"jmlKK":71},{"rw":26,"rt":3,"jmlKK":51},{"rw":26,"rt":4,"jmlKK":91},{"rw":26,"rt":5,"jmlKK":59},{"rw":26,"rt":6,"jmlKK":43},{"rw":26,"rt":"Semua","jmlKK":370},{"rw":27,"rt":1,"jmlKK":96},{"rw":27,"rt":2,"jmlKK":115},{"rw":27,"rt":3,"jmlKK":113},{"rw":27,"rt":4,"jmlKK":41},{"rw":27,"rt":5,"jmlKK":36},{"rw":27,"rt":6,"jmlKK":58},{"rw":27,"rt":"Semua","jmlKK":459},{"rw":28,"rt":1,"jmlKK":45},{"rw":28,"rt":2,"jmlKK":28},{"rw":28,"rt":3,"jmlKK":41},{"rw":28,"rt":4,"jmlKK":38},{"rw":28,"rt":5,"jmlKK":70},{"rw":28,"rt":6,"jmlKK":59},{"rw":28,"rt":"Semua","jmlKK":281},{"rw":29,"rt":1,"jmlKK":158},{"rw":29,"rt":2,"jmlKK":104},{"rw":29,"rt":3,"jmlKK":73},{"rw":29,"rt":"Semua","jmlKK":335},{"rw":30,"rt":1,"jmlKK":158},{"rw":30,"rt":2,"jmlKK":82},{"rw":30,"rt":3,"jmlKK":57},{"rw":30,"rt":4,"jmlKK":79},{"rw":30,"rt":"Semua","jmlKK":376},{"rw":31,"rt":1,"jmlKK":135},{"rw":31,"rt":2,"jmlKK":71},{"rw":31,"rt":3,"jmlKK":40},{"rw":31,"rt":4,"jmlKK":67},{"rw":31,"rt":5,"jmlKK":100},{"rw":31,"rt":"Semua","jmlKK":413},{"rw":32,"rt":1,"jmlKK":130},{"rw":32,"rt":2,"jmlKK":160},{"rw":32,"rt":3,"jmlKK":63},{"rw":32,"rt":4,"jmlKK":56},{"rw":32,"rt":5,"jmlKK":58},{"rw":32,"rt":6,"jmlKK":22},{"rw":32,"rt":"Semua","jmlKK":489},{"rw":33,"rt":1,"jmlKK":47},{"rw":33,"rt":2,"jmlKK":46},{"rw":33,"rt":3,"jmlKK":46},{"rw":33,"rt":4,"jmlKK":47},{"rw":33,"rt":"Semua","jmlKK":186},{"rw":34,"rt":1,"jmlKK":165},{"rw":34,"rt":2,"jmlKK":88},{"rw":34,"rt":3,"jmlKK":166},{"rw":34,"rt":"Semua","jmlKK":419},{"rw":35,"rt":1,"jmlKK":84},{"rw":35,"rt":2,"jmlKK":93},{"rw":35,"rt":3,"jmlKK":66},{"rw":35,"rt":4,"jmlKK":84},{"rw":35,"rt":"Semua","jmlKK":327},{"rw":36,"rt":1,"jmlKK":86},{"rw":36,"rt":2,"jmlKK":61},{"rw":36,"rt":3,"jmlKK":61},{"rw":36,"rt":"Semua","jmlKK":208},{"rw":37,"rt":1,"jmlKK":82},{"rw":37,"rt":2,"jmlKK":66},{"rw":37,"rt":3,"jmlKK":116},{"rw":37,"rt":"Semua","jmlKK":264},{"rw":38,"rt":1,"jmlKK":0},{"rw":38,"rt":2,"jmlKK":0},{"rw":38,"rt":3,"jmlKK":0},{"rw":38,"rt":"Semua","jmlKK":0},{"rw":39,"rt":1,"jmlKK":0},{"rw":39,"rt":2,"jmlKK":0},{"rw":39,"rt":3,"jmlKK":0},{"rw":39,"rt":"Semua","jmlKK":0},{"rw":"Semua","rt":"Semua","jmlKK":15651}],
		loaded: false,
		iksQuery: [],
		kelSelected: 'MOJOSONGO',
		rwSelected: 'Semua',
		rtSelected: 'Semua',
		fields:{
			no: {
				label: 'No',
			},
			ind: {
				label: 'Indikator',
			},
			y: {
				label: 'Σ Keluarga Bernilai Y',
			},
			penyebut: {
				label: 'Σ Keluarga yang Diukur',
			},
			iks: {
				label: 'IKS',
			}
		},
		resume_fields: {
			"No": "no",
			"RW": 'rw',
			'RT': 'rt',
			'Jumlah KK': 'jmlKK',
			'Jumlah KK Diinput': 'jml',
			'Jumlah Kesenjangan': 'selisih'
		}
	}),
	async mounted (){
		await this.$nextTick( async ()=>{
			this.$nuxt.$loading.start()
			this.loaded = true
			await this.$apollo.query({
				query: getIKSgql,
				prefetch: true,
				variables: {
					pusk: 'sibela'
				}
			})
			.then( ({ data: { getIKS } }) => {
				getIKS.map((e, i) => this.indikator.map(o => this.nilai.map(f => {
					if (f == 'penyebut' && e[o][f] == 0) getIKS[i][o]['iks'] = null
				})))
				this.iksQuery = getIKS
				return
			})
			this.loaded = false
			this.$nuxt.$loading.finish()
		})
	},

	methods:{
		getAttr(params){
			if(params > 0.8) {
				return 'success'
			}	else if(params > 0.499) {
				return 'warning'
			} else if(params >= 0) {
				return 'danger'
			}
		},
		byName(a){
			this.$store.getters['users/isAuthenticated'] ? this.$router.push({ path: `/iks/details?id=${a.key}`}) : this.$store.commit('users/openLogin')
		}
	},

	watch: {
		kelSelected(val){
			this.rwSelected = 'Semua'
		},
		rwSelected(val){
			this.rtSelected = 'Semua'
		},
	},

	computed: {
		json_fields(){
			let a = {}
			Object.keys(this.fields).map( e => {
				a[this.fields[e].label] = e
			})
			return a
		},
		resume(){
			return this.jmlkk
			.map( (e, id) => Object.assign( 
				{}, 
				e, 
				{
					no: id+1,
					_key: `iks-${this.kelSelected.split(' ').join('_')}-${e.rw}-${e.rt}`
				}))
			.map( e => Object.assign(
				{}, 
				e, 
				{
					jml: 0,
					selisih: 0
				}, 
				this.iksQuery.filter(a => a._key == e._key)[0]))
			.map(e => Object.assign( {}, e, {
				selisih: e.jmlKK - e.jml
			}))
		},
		kkInd(){
			let a = {}
			this.jmlkk.map( e=> {
				let _key = `iks-${this.kelSelected.split(' ').join('_')}-${e.rw}-${e.rt}`
				a[_key] = Object.assign({}, e, {
					_key
				})
			})
			return a
		},
		kel(){
			if(Array.isArray(this.iksQuery)) {
				return [...new Set(this.iksQuery.map(({kel}) => kel))].sort()
			}
			return [ 'MOJOSONGO', 'Semua' ]
		},
		rw(){
			if(this.kelSelected === 'MOJOSONGO'){
				return [...new Set(this.jmlkk.map( e => e.rw))].sort((a, b) => a - b)
			}
			return [...new Set(this.iksQuery.filter(({kel}) => kel === this.kelSelected).map(({rw})=>rw).sort((a, b) => a - b))]
		},
		rt(){
			if(this.kelSelected === 'MOJOSONGO'){
				return [...new Set(this.jmlkk.filter(e => e.rw === this.rwSelected).map( e => e.rt))].sort((a, b) => a - b)
			}
			return [...new Set(this.iksQuery.filter(({kel, rw}) => kel === this.kelSelected && rw === this.rwSelected).map(({rt})=> rt).sort((a, b) => a - b))] 
		},
		kesenjangan(){
			return this.iks.jml - this.iks.jmlKK
		},
		iksId(){
			return `iks-${this.kelSelected.split(' ').join('_')}-${this.rwSelected}-${this.rtSelected}`
		},
		iks(){
			return Object.assign({}, this.iksQuery.filter(({_key}) => _key === this.iksId)[0], this.kkInd[this.iksId])
		},
		iksTotal(){
			if(isFinite(this.iks.jml)) {
				return (this.iks.sehat/this.iks.jml).toFixed(3)
			} 
		},
		iksTotalAttr(){
			if(this.iksTotal > 0.8) {
				return {
					variant: 'success',
					text: 'Sehat'
				}
			}	else if(this.iksTotal > 0.499) {
				return {
					variant: 'warning',
					text: 'Pra Sehat'
				}
			} else if(this.iksTotal >= 0) {
				return {
					variant: 'danger',
					text: 'Tidak Sehat'
				}
			} else {
				return {
					variant: 'info',
					text: 'Belum Terindeks'
				}
			}
		},
		template(){
			return [ 'Keluarga mengikuti program Keluarga Berencana (KB)', 'Ibu melakukan persalinan di fasilitas kesehatan',	'Bayi mendapat imunisasi dasar lengkap', 'Bayi mendapat air susu ibu (ASI) eksklusif', 'Balita mendapatkan pematauan pertumbuhan', 'Penderita tuberkulosis paru mendapatkan pengobatan sesuai standar', 'Penderita hipertensi melakukan pengobatan secara teratur', 'Penderita gangguan jiwa mendapatkan pengobatan dan tidak ditelantarkan', 'Anggota keluarga tidak ada yang merokok', 'Keluarga sudah menjadi anggota Jaminan Kesehatan Nasional (JKN)', 'Keluarga mempunyai akses sarana air bersih', 'Keluarga mempunyai akses atau menggunakan jamban sehat'].map( (ind, i) => ({
				no: i+1,
				ind: ind,
				key: this.indikator[i],
				iks: 0
			}))
		},
		items(){
			return this.template.map( ind => Object.assign({}, ind, this.iks[ind.key] ))
		}
	}
}
</script>

