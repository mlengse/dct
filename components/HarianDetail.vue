<template lang="pug">
b-card(noBody)
	b-tabs(small card v-model='weekSelected')
		b-tab(v-for='(week, id) in weeks' :title='`Minggu ke-${week}`' :key='`mg-${id}`')
			b-table(stacked='sm' bordered outlined small hover fixed responsive :items='items' :fields='fields')
				template( slot='pembilang' slot-scope='tgl')
					.row(v-if='editing && tgl.item.isActive' )
						.col-lg
						.col-lg-6
							b-form-input.text-center(type='number' :placeholder='tgl.item[tgl.field.key].jumlah.toString() || "0"' v-model='tgl.item[tgl.field.key].jumlah' @input='inputPembilang(tgl.item)') 
						.col-lg
					.text-center(v-else) {{tgl.item[tgl.field.key].jumlah || 0}}
				template( slot='penyebut' slot-scope='tgl')
					.row(v-if="editing && tgl.item.isActive && tgl.item.penyebut.jumlah !== 1" )
						.col-lg
						.col-lg-6
							b-form-input.text-center(type='number' :placeholder='tgl.item[tgl.field.key].jumlah.toString() || "0"' v-model='tgl.item[tgl.field.key].jumlah' @input='inputPenyebut(tgl.item)') 
						.col-lg
					.text-center(v-else) {{tgl.item[tgl.field.key].jumlah || 0}}
</template>

<script>
import bTabs from '~/node_modules/bootstrap-vue/es/components/tabs/tabs.js';
import bTab from '~/node_modules/bootstrap-vue/es/components/tabs/tab.js';

export default {
	props: ['row', 'editing'],
	components: {
		bTabs,
		bTab
	},
	data: () => ({
		days: [],
		pembilang: 0,
		penyebut: 0,
		weekSelected:0,
	}), 
	methods: {
		inputPembilang(val) {
			this.days[val.id] = val
			this.pembilang = this.row.item.days.reduce((total, item) => total + Number(item.pembilang.jumlah), 0)
			let penyebut = this.row.item.days.reduce((total, item) => total + Number(item.penyebut.jumlah), 0)
			if(penyebut > 0){
				this.penyebut = penyebut
			}
		},
		inputPenyebut(val) {
			this.days[val.id] = val
			this.pembilang = this.days.reduce((total, item) => total + Number(item.pembilang.jumlah), 0)
			let penyebut = this.days.reduce((total, item) => total + Number(item.penyebut.jumlah), 0)
			if(penyebut > 0){
				this.penyebut = penyebut
			}
		},
		getArr() {
			let arr = []
			this.days.map( day => ( ['pembilang', 'penyebut'].map( (countername, id) => {
				let obj = {
					tanggal: this.$moment(day.tanggal, 'DD-MM-YYYY').toISOString(),
					countername: day[countername]._id,
				}
				arr[arr.length] = obj
			})))
			return arr		
		},
	},
	watch: {
		pembilang(val){
			this.$emit('rekapHarian', {
				pembilang: this.pembilang,
				penyebut: this.penyebut,
				arr: this.getArr()
			})
		},
		penyebut(val) {
			this.$emit('rekapHarian', {
				pembilang: this.pembilang,
				penyebut: this.penyebut,
				arr: this.getArr()
			})
		},
	},
	computed: {
		weeks() {
			let weeks = []
			this.row.item.days.map( day => {
				let week = day.week
				if(weeks.indexOf(week) < 0 ) {
					weeks[weeks.length] = week
				}
			})
			return weeks
		},
		fields(){
			return ['hari', 'tanggal', 'pembilang', 'penyebut']
		},
		items() {
			return this.allDays.filter( day => day.week === this.weeks[this.weekSelected])
		},
		allDays(){
			return this.row.item.days.map( dayObj => {
				dayObj.pembilang = Object.assign({}, this.$store.getters['data/gettgl']({
					name: this.row.item.pembilang.name,
					tanggal: dayObj.tanggal
				}), {
					_id: this.row.item.pembilang._id,
					name: this.row.item.pembilang.name,
					type: this.row.item.pembilang.type,
					jumlah: (() => {
						let j = 0
						let a = this.row.item.pembilang.counters.filter(counter=> !counter.isMonth && counter.tgl === dayObj.tanggal)
						a.length ? a[0] ? j =a[0].jumlah : '' : ''
						return j
					})(),
					counters: undefined,
				}, 
				)
				dayObj.penyebut = Object.assign({}, this.row.item.penyebut, {
					jumlah: (this.row.item.penyebut.name.includes('hari') || this.row.item.penyebut.name.includes('visit')) && this.$moment(dayObj.tanggal, 'DD-MM-YYYY').format('dddd') !== 'Minggu' ? 1 : 0,
					counters: undefined
				}, this.$store.getters['data/gettgl']({
					name: this.row.item.penyebut.name,
					tanggal: dayObj.tanggal
				}))
				return dayObj
			})
		}
	}
}
</script>