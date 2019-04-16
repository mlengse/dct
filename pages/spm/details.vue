<template lang="pug">
section.container 
	.row.mt-2
		h3 Detail Indikator SPM 
	.row.mt-2 
	b-table.mt-2(hover :busy.sync='loaded' striped :items='indDet' :fields='fields')
	.row.mt-2
		button.btn.btn-sm.btn-primary(type='button' :disabled='loaded' @click='showDetail') {{ detail ? 'tutup' : 'buka'}} detail
	.card.mt-2(v-show='detail')
		.card-body
			ul.list-group.list-group-flush(v-for='i in ind')
				li.list-group-item
					.row
						.col-md-3 {{i.key}}
						.col {{i.desc}}
	//.row.mt-2 
		pre {{indDet}}

</template>

<script>
import BTable from '~/node_modules/bootstrap-vue/es/components/table/table'

export default {
	components: {
		BTable
	},
	data: () => ({
		loaded: false,
		id: '',
		tahun: '',
		detail: false,
		fields:['bulan', 'pembilang', 'penyebut', {
			key: 'targetbulanan',
			label: 'Target Bulanan'
		}, 'hasil'],
	}),
	async beforeMount(){
		await this.$nextTick( async () => {
			this.$nuxt.$loading.start()
			this.loaded = true
			await Promise.all([
				this.$store.dispatch('spm/ind', this.$route.query.id),
				this.$store.dispatch('spm/indDet', this.$route.query.id)
			])
			this.id = this.$route.query.id
			this.tahun = this.$route.query.tahun
			this.$nuxt.$loading.finish()
			this.loaded = false
    })

	},
	methods: {
		showDetail(){
			this.detail = !this.detail
		}
	},
	computed: {
		indDet(){
			return this.$store.getters['spm/indDet'](this.id).map(e=>Object.assign({}, JSON.parse(e), {
				bulan: this.$moment(JSON.parse(e).bulan, 'MM').format('MMMM'),
				targetbulanan: Math.floor(Number(JSON.parse(e).targetbulanan) * 100) /100,
				hasil: Math.floor(Number(JSON.parse(e).hasil) * 100) / 100
			})).filter(e => this.$moment(e.bulan, 'MMMM').isBefore(this.$moment(this.$moment().format('MMMM'), 'MMMM')))
		},
		ind(){
			return this.$store.getters['spm/ind'](this.id)
		}
	}
}
</script>

<!--style>
@import	"@/node_modules/bootstrap/dist/css/bootstrap.css";
@import	"@/node_modules/bootstrap-vue/dist/bootstrap-vue.css";
</style--!>


