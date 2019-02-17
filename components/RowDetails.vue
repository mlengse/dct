<template lang="pug">
b-card
	.container.mt-3
		.list-group
			.list-group-item
				.row
					.col.text-right Capaian
					.col-md-2.col-sm-3 {{row.item.rekap.jumlah.toFixed()}} %
			.list-group-item
				.row
					.col.text-right Target
					.col-md-2.col-sm-3 {{row.item.target}}
	.container.mt-3
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
						b-form-input.text-right(v-if='editing && !rincian' type='number' :placeholder='row.item.pembilang.jumlah.toString()' v-model='row.item.pembilang.jumlah')
						.text-right(v-else) {{row.item.pembilang.jumlah}}
			.list-group-item
				b-row
					.col-lg-2.col-md-3
						dt.text-right Penyebut
					.col
						dd {{row.item.penyebut.name}}
					.col-md-2
						b-form-input.text-right(v-if="editing && !rincian && !penyebutEdit"  type='number' :placeholder='row.item.penyebut.jumlah.toString()' v-model='row.item.penyebut.jumlah')
						.text-right(v-else) {{row.item.penyebut.jumlah}}
	harian-detail(v-if='rincian' :row='row' :editing='editing' @rekapHarian='rekapHarian')

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
		arrRekap: []
	}),
	watch:{
		rowItemRekapJumlah(val){
			this.row.item.rekap.jumlah =  val
		},
	},
	methods: {
		rekapHarian(val){
			this.arrRekap = val.arr
		},
		toggleButton() {
			this.isAuth ? this.editing = !this.editing : this.$store.commit('users/openLogin')
		},
		async simpan() {
			this.isAuth ? this.editing = !this.editing : this.$store.commit('users/openLogin')
			this.$nuxt.$loading.start()
			//this.$emit('save')
			this.row.item.status = this.row.item.rekap ? (this.row.item.operator === '>=' ? (this.row.item.rekap.jumlah >= this.row.item.numtarget ? 'Tercapai' : 'Belum tercapai') : (this.row.item.rekap.jumlah <= this.row.item.numtarget ? 'Tercapai' : 'Belum tercapai')) : 'Belum diinput'
			this.row.item.variant = this.row.item.rekap ? (this.row.item.operator === '>=' ? (this.row.item.rekap.jumlah >= this.row.item.numtarget ? 'success' : 'danger') : (this.row.item.rekap.jumlah <= this.row.item.numtarget ? 'success' : 'danger')) : 'warning'
			if (this.rekapSend.jumlah > 0 ) {
				await this.$store.dispatch('data/sendRekap', {...this.rekapSend})
			}
			//console.log(JSON.stringify(this.pembilangSend, null, 2))
			if(this.pembilangSend.jumlah > 0) {
				await this.$store.dispatch('data/sendCounter', {...this.pembilangSend})
			}
			if(this.penyebutSend.jumlah > 0) {
	 			await this.$store.dispatch('data/sendCounter', {...this.penyebutSend})
			}
			//console.log('month done')
			this.row.item.harianApplied && this.arrRekap.length ? await this.row.item.days.map( async day => {
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
				return true
			}) : null
			//console.log('days done')
			this.$nuxt.$loading.finish()
			///this.$emit('save')
			this.$emit('updateMonth', this.row.item.month)
		},
		convertSend(day, row, type){
			//console.log(JSON.stringify(day, null, 2))
			return {
				_id: day[type] ? day[type]._id : undefined,
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
		penyebutEdit(){
			return this.row.item.penyebut.name == Number(this.row.item.penyebut.name) || this.row.item.penyebut.name.includes('hari') || this.row.item.penyebut.name.includes('visit')
		},
		rowItemRekapJumlah() {
			return this.row.item.penyebut.jumlah > 0 
			? 100*this.row.item.pembilang.jumlah/this.row.item.penyebut.jumlah 
			: 0
		},
		pembilangSend(){
			//console.log(this.row.item.pembilang.jumlah)
			return {
				_id: this.row.item.pembilang._id,
				jumlah: Number(this.row.item.pembilang.jumlah),
				countername: this.row.item.pembilang.counternameId,
				waktu: this.$moment(this.row.item.month, 'MMMM YYYY').toISOString()
			}
		},
		penyebutSend(){
			return {
				_id: this.row.item.penyebut._id,
				jumlah: Number(this.row.item.penyebut.jumlah),
				countername: this.row.item.penyebut.counternameId,
				waktu: this.$moment(this.row.item.month, 'MMMM YYYY').toISOString()
			}
		},
		rekapSend(){
			return {
				_id: this.row.item.rekap ? this.row.item.rekap._id : undefined,
				jumlah: Number(this.row.item.rekap.jumlah),
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