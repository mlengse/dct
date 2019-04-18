<template lang="pug">
section.container 
	.row.mt-2
		h3 Indeks Keluarga Sehat Wilayah
	.row.mt-2
		.col-md-6.mt-2
			b-input-group(prepend='Kelurahan' size='sm')
				b-form-select(v-model='kelSelected' :options='kel' size='sm')
		.col-md-3.mt-2
			b-input-group(prepend='RW' size='sm')
				b-form-select(v-model='rwSelected' :options='rw' size='sm')
		.col-md-3.mt-2
			b-input-group(prepend='RT' size='sm')
				b-form-select(v-model='rtSelected' :options='rt' size='sm')
	.row.mt-2
	.btn-toolbar
		download-excel.mr-2(:data="items" :loaded='loaded' :fields="json_fields" :name='iksId + ".xlsx"' label='Download IKS') 
		download-excel.mr-2(:data="resume" :loaded='loaded' :fields="resume_fields" name='resume_pispk.xlsx' label='Download Resume Pelaksanaan') 
	.row.mt-2
	.card
		.card-body
			.list-group
				.list-group-item
					.row
						.col IKS 
						.col(:class='["text", iksTotalAttr.variant].join("-")') {{iksTotal}}  
						.col-md-6
							span.badge(:class='["badge", iksTotalAttr.variant].join("-")') {{iksTotalAttr.text}}
				.list-group-item
					.row
						.col Jumlah Keluarga
						.col {{iks.jmlKK}}
						.col-md-6
							b-progress(:value="iks.jmlKK" :max="iks.jmlKK" variant='secondary')
				.list-group-item
					.row
						.col Jumlah Terindeks
						.col {{iks.jml}}
							span(v-if='kesenjangan')  ({{kesenjangan}})
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
		loaded: false,
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

	apollo: {
		iksQuery: {
			query: getIKSgql,
			//prefetch: true,
			variables: {
				pusk: 'sibela'
			},
			update({getIKS}){
    		this.$store.commit('iks/add', getIKS)
			}
		}
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
			this.$store.getters['users/isAuthenticated'] ? this.$router.push({ path: `/iks/${a.key}`}) : this.$store.commit('users/openLogin')
		}
	},
	watch: {
		kelSelected(val){
			this.rwSelected = 'Semua'
		},
		rwSelected(val){
			this.rtSelected = 'Semua'
		}
	},
	/*
	async beforeMount(){
		await this.$nextTick( async () => {
			this.$nuxt.$loading.start()
			this.loaded = true
			await this.$store.dispatch('iks/all')
			this.loaded = false
			this.$nuxt.$loading.finish()
		})

	},
	fetch: async ({store}) => await store.dispatch('iks/all'),
	*/
	computed: {
		json_fields(){
			let a = {}
			Object.keys(this.fields).map( e => {
				a[this.fields[e].label] = e
			})
			return a
		},
		resume(){
			return this.jmlkk.map( (e, id) => Object.assign( {}, e, {
				no: id+1,
				_key: `iks-MOJOSONGO-${e.rw}-${e.rt}`
			})).map( e => Object.assign({}, e, {
				jml: 0,
				selisih: 0
			}, this.$store.getters['iks/iks'](e._key))).map(e => Object.assign( {}, e, {
				selisih: e.jmlKK - e.jml
			}))
		},
		kkInd(){
			let a = {}
			this.jmlkk.map( e=> {
				let _key = `iks-MOJOSONGO-${e.rw}-${e.rt}`
				a[_key] = Object.assign({}, e, {
					_key
				})
			})
			return a
		},
		jmlkk(){
			return this.$store.state.iks.jmlkk
		},
		kel(){
			return this.$store.getters['iks/kel']
		},
		rw(){
			if(this.kelSelected === 'MOJOSONGO'){
				return [...new Set(this.jmlkk.map( e => e.rw))].sort((a, b) => a - b)
			}
			return this.$store.getters['iks/rw']({kel: this.kelSelected})
		},
		rt(){
			if(this.kelSelected === 'MOJOSONGO'){
				return [...new Set(this.jmlkk.filter(e => e.rw===this.rwSelected).map( e => e.rt))].sort((a, b) => a - b)
			}
			return this.$store.getters['iks/rt']({
				kel: this.kelSelected,
				rw: this.rwSelected
			})
		},
		kesenjangan(){
			return this.iks.jml - this.iks.jmlKK
		},
		iksId(){
			return `iks-${this.kelSelected.split(' ').join('_')}-${this.rwSelected}-${this.rtSelected}`
		},
		iks(){
			return Object.assign({}, 
			this.$store.getters['iks/iks'](this.iksId), 
			this.kkInd[this.iksId])
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
			let a = [ "kb", "salinFaskes", "imun", "asi", "tumbuh", "tb", "ht", "jiwa", "rokok", "jkn", "ab",  "jamban",]
			return [ 'Keluarga mengikuti program Keluarga Berencana (KB)', 'Ibu melakukan persalinan di fasilitas kesehatan',	'Bayi mendapat imunisasi dasar lengkap', 'Bayi mendapat air susu ibu (ASI) eksklusif', 'Balita mendapatkan pematauan pertumbuhan', 'Penderita tuberkulosis paru mendapatkan pengobatan sesuai standar', 'Penderita hipertensi melakukan pengobatan secara teratur', 'Penderita gangguan jiwa mendapatkan pengobatan dan tidak ditelantarkan', 'Anggota keluarga tidak ada yang merokok', 'Keluarga sudah menjadi anggota Jaminan Kesehatan Nasional (JKN)', 'Keluarga mempunyai akses sarana air bersih', 'Keluarga mempunyai akses atau menggunakan jamban sehat'].map( (ind, i) => ({
				no: i+1,
				ind: ind,
				key: a[i],
				iks: 0
			}))
		},
		items(){
			return this.template.map( ind => Object.assign({}, ind, this.iks[ind.key] ))
		}
	}
}
</script>

<!--style>
@import	"@/node_modules/bootstrap/dist/css/bootstrap.css";
@import	"@/node_modules/bootstrap-vue/dist/bootstrap-vue.css";
</style--!>
