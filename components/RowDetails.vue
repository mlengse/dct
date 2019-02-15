<template lang="pug">
b-card
	.container
		dl
			.list-group-item
				b-row(align-h='end')
					b-button-group
						b-button(:disabled='loaded' size='sm' v-if='row.item.harianApplied' variant='primary' @click.stop='rinci') {{rincishow}} harian
						b-button(:disabled='loaded' size='sm' v-if='editing' variant='success' @click.stop='simpan') simpan
						b-button(:disabled='loaded' size='sm' v-else variant='warning' @click.stop='toggleButton') edit
			.list-group-item
				.row
					.col-lg-2.col-md-3
						dt.text-right Pembilang
					.col
						dd {{row.item.pembilang.name}}
					.col-md-2
						b-form-input.text-right(v-if='editing && !rincian' type='number' :placeholder='row.item.pembilang.jumlah ? row.item.pembilang.jumlah.toString() : "0"' v-model='row.item.pembilang.jumlah')
						.text-right(v-else) {{row.item.pembilang.jumlah || 0}}
			.list-group-item
				b-row
					.col-lg-2.col-md-3
						dt.text-right Penyebut
					.col
						dd {{row.item.penyebut.name}}
					.col-md-2
						b-form-input.text-right(v-if="editing && !rincian"  type='number' :placeholder='row.item.penyebut.jumlah ? row.item.penyebut.jumlah.toString() : "0"' v-model='row.item.penyebut.jumlah')
						.text-right(v-else) {{row.item.penyebut.jumlah || 0}}
	harian-detail(v-if='rincian' :row='row' :editing='editing' @rekapHarian='rekapHarian')
	.container.mt-3
		.list-group
			.list-group-item
				.row
					.col.text-right Capaian
					.col-md-2.col-sm-3 {{row.item.rekap.jumlah}} % 
			.list-group-item
				.row
					.col.text-right Target
					.col-md-2.col-sm-3 {{row.item.target}}

</template>

<script>
import HarianDetail from '~/components/HarianDetail.vue'

export default {
	components: {
		HarianDetail
	},
	props: ["row", 'loaded'],
	data: () => ({
		editing: false,
		rincian: false,
		rowRekap: null,
		pembilangRekap: 0,
		penyebutRekap: 0,
		arrRekap: []
	}),
	methods: {
		rekapHarian(val){
			this.pembilangRekap = val.pembilang
			this.penyebutRekap = val.penyebut
			this.arrRekap = val.arr
		},
		toggleButton() {
			this.isAuth ? this.editing = !this.editing : this.$store.commit('users/openLogin')
		},
		async simpan() {
			this.isAuth ? this.editing = !this.editing : this.$store.commit('users/openLogin')
			this.$nuxt.$loading.start()
			this.$emit('save', true)
			this.$nuxt.$loading.finish()
			this.$emit('save', false)
		},
		rinci() {
			this.rincian = !this.rincian;
		},
	},
	computed: {
		rincishow() {
			if(this.rincian){
				return 'tutup'
			}
			return 'buka'
		},
		isAuth(){
			return this.$store.getters['users/isAuthenticated']
		},
	}
};
</script>