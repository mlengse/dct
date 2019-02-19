<template lang="pug">
section.container 
	.row.mt-2
		h3 Detail Indikator SPM 
	.row.mt-2
		b-button(size='sm' variant='primary' @click='showDetail') {{ detail ? 'tutup' : 'buka'}} detail
	b-card.mt-2(v-show='detail')
		ul.list-group.list-group-flush(v-for='i in ind')
			li.list-group-item
				.row
					.col-md-3 {{i.key}}
					.col {{i.desc}}
	.row.mt-2 
	b-table.mt-2(hover striped :items='indDet' :fields='fields')
	//.row.mt-2 
		pre {{indDet}}

</template>

<script>
export default {
	data: () => ({
		id: '',
		tahun: '',
		detail: false,
		fields:['bulan', 'pembilang', 'penyebut', {
			key: 'targetbulanan',
			label: 'Target Bulanan'
		}, 'hasil'],
	}),
	async created(){
		await this.$store.dispatch('spm/ind', this.$route.query.id)
		await this.$store.dispatch('spm/indDet', this.$route.query.id)
		this.id = this.$route.query.id
		this.tahun = this.$route.query.tahun
	},
	methods: {
		showDetail(){
			this.detail = !this.detail
		}
	},
	computed: {
		indDet(){
			return this.$store.state.spm.indDet.map(e=>Object.assign({}, JSON.parse(e), {
				bulan: this.$moment(JSON.parse(e).bulan, 'MM').format('MMMM')
			}))
		},
		ind(){
			return this.$store.getters['spm/ind'](this.id)
		}
	}
}
</script>

