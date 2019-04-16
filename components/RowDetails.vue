<template lang="pug">
.card
	.card-body
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
					.row.justify-content-end
						.btn-group.mx-1(size='sm')
							button.btn.btn-sm.btn-success(type='button' :disabled='loaded' v-if='editing' @click.stop='simpan') simpan
							button.btn.btn-sm.btn-warning(type='button' :disabled='loaded' v-else @click.stop='toggleButton') edit
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
					.row
						.col-lg-2.col-md-3
							dt.text-right Penyebut
						.col
							dd {{row.item.penyebut.name}}
						.col-md-2
							b-form-input.text-right(v-if="editing && !rincian && !penyebutEdit"  type='number' :placeholder='row.item.penyebut.jumlah.toString()' v-model='row.item.penyebut.jumlah')
							.text-right(v-else) {{row.item.penyebut.jumlah}}
		b-modal#modalInfo(@hide='resetModal' :title='modalInfo.title' ok-only)
			pre {{modalInfo.content}}

</template>

<script>
const BModal = () => import('~/node_modules/bootstrap-vue/es/components/modal/modal')
const vBModal = () => import('~/node_modules/bootstrap-vue/es/directives/modal/modal')
const BFormInput = () => import('~/node_modules/bootstrap-vue/es/components/form-input/form-input')

export default {
	components: {
		BFormInput,
		'b-modal': BModal
	},
	directives: {
		'b-modal': vBModal
	},
	props: ["row", 'loaded'],
	data: () => ({
		editing: false,
		rincian: false,
		rowRekap: null,
		modalInfo: { title: '', content: '' }
	}),
	watch:{
		rowItemRekapJumlah(val){
			this.row.item.rekap.jumlah =  val
		},
	},
	methods: {
		resetModal() {
			this.modalInfo.title = ''
			this.modalInfo.content = ''
		},
		info(item, index, button) {
			this.modalInfo.title = `Row index: ${index}`
			this.modalInfo.content = JSON.stringify(item, null, 2)
			this.$root.$emit('bv::show::modal', 'modalInfo', button)
		},
		toggleButton() {
			this.isAuth ? this.editing = !this.editing : this.$store.commit('users/openLogin')
		},
		async simpan() {
			this.isAuth ? this.editing = !this.editing : this.$store.commit('users/openLogin')
			await this.$emit('save', {
				rekap: {...this.rekapSend},
				pembilang: {...this.pembilangSend},
				penyebut: {...this.penyebutSend}
			})
			this.row.item.status = this.row.item.rekap ? (this.row.item.operator === '>=' ? (this.row.item.rekap.jumlah >= this.row.item.numtarget ? 'Tercapai' : 'Belum tercapai') : (this.row.item.rekap.jumlah <= this.row.item.numtarget ? 'Tercapai' : 'Belum tercapai')) : 'Belum diinput'
			this.row.item.variant = this.row.item.rekap ? (this.row.item.operator === '>=' ? (this.row.item.rekap.jumlah >= this.row.item.numtarget ? 'success' : 'danger') : (this.row.item.rekap.jumlah <= this.row.item.numtarget ? 'success' : 'danger')) : 'warning'
			
		},
		convertSend(day, row, type){
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