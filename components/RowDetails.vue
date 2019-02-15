<template lang="pug">
b-card
	.container
		dl
			.list-group-item
				b-row(align-h='end')
					b-button-group
						b-button(:disabled='loaded' size='sm' v-if='harianApplied' variant='primary' @click.stop='rinci') {{rincishow}} harian
						b-button(:disabled='loaded' size='sm' v-if='editing' variant='success' @click.stop='simpan') simpan
						b-button(:disabled='loaded' size='sm' v-else variant='warning' @click.stop='toggleButton') edit
			.list-group-item
				.row
					.col-lg-2.col-md-3
						dt.text-right Pembilang
					.col
						dd {{rowitem.pembilang}}
					.col-md-2
						b-form-input.text-right(v-if='editing && !rincian && pembilangRekap === 0 && pembilangPredefined === 0 ' type='number' :placeholder='pembilang.toString()' v-model='pembilangInput')
						.text-right(v-else) {{pembilang}}
			.list-group-item
				b-row
					.col-lg-2.col-md-3
						dt.text-right Penyebut
					.col
						dd {{rowitem.penyebut}}
					.col-md-2
						b-form-input.text-right(v-if="editing && !rincian && penyebutRekap === 0 && penyebutPredefined === 0 && rowitem.penyebut != penyebut && !rowitem.penyebut.includes('hari')"  type='number' :placeholder='penyebut.toString()' v-model='penyebutInput')
						.text-right(v-else) {{penyebut}}
	harian-detail(v-if='rincian' :desc='desc' :rowitem='rowitem' :month='month' :editing='editing' @rekapHarian='rekapHarian')
	.container.mt-3
		.list-group
			.list-group-item
				.row
					.col.text-right Capaian
					.col-md-2.col-sm-3 {{rekap}} 
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
	props: ["row", "month", 'loaded'],
	data: () => ({
		editing: false,
		rincian: false,
		rowRekap: null,
		arrRekap: [],
		pembilangRekap: 0,
		penyebutRekap: 0,
		pembilangInput: 0,
		penyebutInput: 0,
		pembilangPredefined: 0,
		penyebutPredefined: 0,
		pembilangFromDB: 0,
		penyebutFromDB: 0,
	}),
	methods: {
		toggleButton() {
			this.isAuth ? this.editing = !this.editing : this.$store.commit('users/openLogin')
		},
		async simpan() {
			let vm = this
			this.isAuth ? this.editing = !this.editing : this.$store.commit('users/openLogin')
			this.$nuxt.$loading.start()
			this.$emit('save', true)
			try {
				this.rowRekap && await this.$store.dispatch('data/sendRekap', {
					rekap: this.rowRekap
				})
				await this.desc.map( async des => await this.$store.dispatch('data/sendCounter', {
					counter: {
						jumlah: Number(this[des.type]),
						waktu: this.$moment(this.month, 'MMMM YYYY').toISOString(),
						countername: {
							_id: des._id
						}
					}
				}))
				//console.log(this.arrRekap.length)
				this.arrRekap.length && await this.arrRekap.map( async rekap => {
					//console.log(JSON.stringify(rekap, null, 2))
					await this.$store.dispatch('data/sendCounter', { vm: this, counter: rekap })
					//console.log('done')
				})

			} catch(err){
				throw err
			}
			this.$nuxt.$loading.finish()
			this.$emit('save', false)
		//	console.log('done')

		},
		rinci() {
			this.rincian = !this.rincian;
		},
		rekapHarian(val){
			//console.log(val)
			this.pembilangRekap = val.pembilang
			this.penyebutRekap = val.penyebut
			this.arrRekap = val.arr
			//console.log(this.arrRekap.length)
		},
	},
	watch: {
		rekap(val) {
			this.rowRekap = this.rowitem.rekap = {
				periode: this.month,
				jumlah: Number(val.split(' ')[0]),
				indicator: {
					_id: this.rowitem._id
				}
			}
		},
		month(val) {
			if (this.rowitem.penyebut == Number(this.rowitem.penyebut)) {
				this.penyebutPredefined = Number(this.rowitem.penyebut)
			}
			if(this.rowitem.penyebut.includes('hari')){
				this.penyebutPredefined = this.hariKerja
			}
		}
	},
	async created(){
		if (this.rowitem.penyebut == Number(this.rowitem.penyebut)) {
			this.penyebutPredefined = Number(this.rowitem.penyebut)
		}
		if(this.rowitem.penyebut.includes('hari')){
			this.penyebutPredefined = this.hariKerja
		}
		if(this.rowitem.penyebut.includes('visite')){
			this.penyebutPredefined = this.hariKerja
		}
		for(let des of this.desc) {
			let res = await this.$store.dispatch('data/counterTimeName', {
				waktu: this.$moment(this.month, 'MMMM YYYY').toISOString(),
				countername: des._id
			})
			if(res) this[`${des.type}FromDB`] = res.jumlah
		//	des[this.$moment(res.waktu, this.$moment.ISO_8601).format('MMMM YYYY')] = res
		}
	},
	computed: {
		pembilang(){
			//console.log('--')
			//console.log(this.pembilangRekap)
			//console.log(this.pembilangFromDB)
			//console.log(this.pembilangPredefined)
			//console.log(this.pembilangInput)
			return this.pembilangRekap > 0 ? this.pembilangRekap : this.pembilangFromDB > 0 ? this.pembilangFromDB : this.pembilangPredefined ? this.pembilangPredefined : this.pembilangInput
		},
		penyebut(){
			return this.penyebutRekap > 0 ? this.penyebutRekap : this.penyebutFromDB > 0 ? this.penyebutFromDB : this.penyebutPredefined ? this.penyebutPredefined : this.penyebutInput
		},
		rekap() {
			return this.pembilang / this.penyebut &&
				this.pembilang / this.penyebut !== Infinity
				? `${((this.pembilang / this.penyebut) * 100).toFixed(1)} %`
				: this.rowitemrekap
				? `${this.rowitemrekap.jumlah} %`
				: "0 %";
		},
		harianApplied() {
			return this.rowitem.penyebut.includes('hari') 
			|| this.rowitem.penyebut.includes('pasien')
			|| this.rowitem.penyebut.includes('visite')
		},
		rincishow() {
			if(this.rincian){
				return 'tutup'
			}
			return 'buka'
		},
		rowitemrekap(){
			let rekap = null
			if (this.rowitem.rekaps.length) {
				for (let rekapId of this.rowitem.rekaps) {
					let rek = this.$store.getters['data/rekap'](rekapId)
					if (rek.periode === this.month) {
						rekap = rek
					}
				}
			}
			return rekap
		},
		rowitem(){
			let vm = this
			let rowitem = this.row.item
			for(let des of this.desc) {
				rowitem[des.type] = des.name
			}
			return rowitem
		},
		desc(){
			return this.row.item.counternames.map(counternameId => this.$store.getters['data/countername'](counternameId))
		},
		isAuth(){
			return this.$store.getters['users/isAuthenticated']
		},
		hariKerja(){
			let startOfMonth = this.$moment(this.month, 'MMMM YYYY').startOf("month");
			let endOfMonth = this.$moment(this.month, 'MMMM YYYY').endOf("month");
			let day = startOfMonth;
			let hk = 0
			//console.log(JSON.stringify(this.row.item, null, 2))
			while (day <= endOfMonth) {
				if(day.format('dddd') !== 'Minggu') {
					hk++
				}
				day = day.clone().add(1, "d");
			}
			return hk
		}
	}
};
</script>