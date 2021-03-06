<template lang="pug">
section.container 
	.row.mt-2
		h3 Indeks Keluarga Sehat Wilayah Purwosari
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
	.row.mt-2
	.btn-toolbar
		download-excel.mr-2(:data="items" :loaded='loaded' :fields="json_fields" :name='iksId + ".xlsx"' label='Download IKS') 
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
						.col Jumlah Terindeks
						.col {{iks.jml}}
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

</template>
<script>
import getIKSgql from '~/apollo/queries/getIKS.gql'

export default {
	layout: 'purwosari',
	head(){
		return {
			title: "Puskesmas Purwosari",
		}
	},

	components: {
		bInputGroup: () => import('~/node_modules/bootstrap-vue/es/components/input-group/input-group'),
		bFormSelect: () => import('~/node_modules/bootstrap-vue/es/components/form-select/form-select'),
		bProgress: () => import('~/node_modules/bootstrap-vue/es/components/progress/progress'),
		DownloadExcel: () => import('~/components/DownloadExcel.vue'),
		BTable: () => import('~/node_modules/bootstrap-vue/es/components/table/table'),
	},
	data: () => ({
		indikator: ['kb', 'salinFaskes', 'imun', 'ab', 'jamban', 'rokok', 'asi', 'tumbuh', 'tb', 'ht', 'jkn', 'jiwa'],
		nilai: ['y', 'penyebut', 'iks'],
		loaded: false,
		kelSelected: 'PURWOSARI',
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
	}),

	apollo: {
		iksQuery: {
			query: getIKSgql,
			variables: {
				pusk: 'purwosari'
			},
			update({getIKS}){
				getIKS.map((e, i) => this.indikator.map(o => this.nilai.map(f => {
					if (f == 'penyebut' && e[o][f] == 0) getIKS[i][o]['iks'] = null
				})))
				return getIKS
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
	},

	watch: {
		kelSelected(val){
			this.rwSelected = 'Semua'
		},
		rwSelected(val){
			this.rtSelected = 'Semua'
		},
		iksQuery(val){
			if(val){
				this.ik = Object.assign({}, this.iks, this.iksQuery.filter(e=> e._key == this.iksId)[0])
			}
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
		kel(){
			return [...new Set(this.iksQuery.map(({kel}) => kel))].sort()
		},
		rw(){
			return [...new Set(this.iksQuery.filter(({kel}) => kel === this.kelSelected).map(({rw})=>rw).sort((a, b) => a - b))]
		},
		rt(){
			return [...new Set(this.iksQuery.filter(({kel, rw}) => kel === this.kelSelected && rw === this.rwSelected).map(({rt})=> rt).sort((a, b) => a - b))] 
		},
		iksId(){
			return `iks-${this.kelSelected.split(' ').join('_')}-${this.rwSelected}-${this.rtSelected}`
		},
		iks(){
			return Object.assign({}, this.ik, this.iksQuery.filter(({_key}) => _key === this.iksId)[0])
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

