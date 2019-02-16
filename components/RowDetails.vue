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
						b-form-input.text-right(v-if='editing && !rincian' type='number' :placeholder='pembilangRekap.toString() || row.item.pembilang.jumlah.toString() || "0"' v-model='row.item.pembilang.jumlah')
						.text-right(v-else) {{pembilangRekap || row.item.pembilang.jumlah || 0}}
			.list-group-item
				b-row
					.col-lg-2.col-md-3
						dt.text-right Penyebut
					.col
						dd {{row.item.penyebut.name}}
					.col-md-2
						b-form-input.text-right(v-if="editing && !rincian"  type='number' :placeholder='penyebutRekap.toString() || row.item.penyebut.jumlah.toString() || "0"' v-model='row.item.penyebut.jumlah')
						.text-right(v-else) {{penyebutRekap || row.item.penyebut.jumlah || 0}}
	harian-detail(v-if='rincian' :row='row' :editing='editing' @rekapHarian='rekapHarian')
	.container.mt-3
		.list-group
			.list-group-item
				.row
					.col.text-right Capaian
					.col-md-2.col-sm-3 {{rekap}} %
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
			this.row.item.status = this.row.item.rekap ? (this.row.item.operator === '>=' ? (this.row.item.rekap.jumlah >= this.row.item.numtarget ? 'Tercapai' : 'Belum tercapai') : (this.row.item.rekap.jumlah <= this.row.item.numtarget ? 'Tercapai' : 'Belum tercapai')) : 'Belum diinput'
			this.row.item.variant = this.row.item.rekap ? (this.row.item.operator === '>=' ? (this.row.item.rekap.jumlah >= this.row.item.numtarget ? 'success' : 'danger') : (this.row.item.rekap.jumlah <= this.row.item.numtarget ? 'success' : 'danger')) : 'warning'
			if (this.rekapSend.jumlah > 0 ) {
				await this.$store.dispatch('data/sendRekap', {...this.rekapSend})
			}
			console.log(JSON.stringify(this.pembilangSend, null, 2))
			if(this.pembilangSend.jumlah > 0) {
				await this.$store.dispatch('data/sendCounter', {...this.pembilangSend})
			}
			if(this.penyebutSend.jumlah > 0) {
	 			await this.$store.dispatch('data/sendCounter', {...this.penyebutSend})
			}
			this.row.item.harianApplied && this.arrRekap.length && this.row.item.days.map( async day => {
				if(day.pembilang){
					let pembilangConvert = this.convertSend( day, this.row, 'pembilang')
					//console.log(JSON.stringify(pembilangConvert, null, 2))
					if(pembilangConvert.jumlah > 0) {
						await this.$store.dispatch('data/sendCounter', {...pembilangConvert})
					}
				}

				if(day.penyebut){
					let penyebutConvert = this.convertSend( day, this.row, 'penyebut')
					if(penyebutConvert.jumlah > 0) {
						await this.$store.dispatch('data/sendCounter', {...penyebutConvert})
					}

				}

			})
			this.$nuxt.$loading.finish()
			this.$emit('save', false)
			this.$emit('updateMonth', this.row.item.month)
		},
		convertSend(day, row, type){
			return {
				jumlah: Number(day[type].jumlah) || 0,
				countername: row.item[type]._id,
				waktu: this.$moment(day.tanggal, 'DD-MM-YYYY').add(1, 'second').toISOString()
			}
		},
		rinci() {
			this.rincian = !this.rincian;
		},
	},
	computed: {
		rekap() {
			return this.pembilangRekap / this.penyebutRekap && this.pembilangRekap / this.penyebutRekap !== Infinity
				? ((this.pembilangRekap / this.penyebutRekap) * 100).toFixed(1)
				: this.row.item.pembilang.jumlah / this.row.item.penyebut.jumlah && this.row.item.pembilang.jumlah / this.row.item.penyebut.jumlah !== Infinity 
				? ((this.row.item.pembilang.jumlah / this.row.item.penyebut.jumlah) * 100).toFixed(1)
				:this.row.item.rekap
				? this.row.item.rekap.jumlah
				: 0;
		},
		pembilangSend(){
			return {
				jumlah: Number(this.row.item.pembilang.jumlah) || 0,
				countername: this.row.item.pembilang._id,
				waktu: this.$moment(this.row.item.month, 'MMMM YYYY').toISOString()
			}
		},
		penyebutSend(){
			return {
				jumlah: Number(this.row.item.penyebut.jumlah) || 0,
				countername: this.row.item.penyebut._id,
				waktu: this.$moment(this.row.item.month, 'MMMM YYYY').toISOString()
			}
		},
		rekapSend(){
			return {
				_id: this.row.item.rekap ? this.row.item.rekap._id : undefined,
				jumlah: Number(this.rekap),
				periode: this.row.item.month,
				indicator: this.row.item._id
			}
		},
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