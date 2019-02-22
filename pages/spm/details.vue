<template lang="pug">
section.container 
	.row.mt-2
		h3 Detail Indikator SPM 
	.row.mt-2
		b-button( :disabled='loaded' size='sm' variant='primary' @click='showDetail') {{ detail ? 'tutup' : 'buka'}} detail
	b-card.mt-2(v-show='detail')
		ul.list-group.list-group-flush(v-for='i in ind')
			li.list-group-item
				.row
					.col-md-3 {{i.key}}
					.col {{i.desc}}
	.row.mt-2 
	b-table.mt-2(hover :busy.sync='loaded' striped :items='indDet' :fields='fields')
	//.row.mt-2 
		pre {{indDet}}

</template>

<script>
import BButton from '~/node_modules/bootstrap-vue/es/components/button/button'
import BCard from '~/node_modules/bootstrap-vue/es/components/card/card'
import BTable from '~/node_modules/bootstrap-vue/es/components/table/table'

export default {
	components: {
		BButton,
		BCard,
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
	async mounted(){
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

<style>
@import	"@/node_modules/bootstrap/dist/css/bootstrap.css";
@import	"@/node_modules/bootstrap-vue/dist/bootstrap-vue.css";
</style>


