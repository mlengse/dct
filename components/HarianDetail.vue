<template lang="pug">
b-card(noBody)
	b-tabs(small card v-model='weekSelected')
		b-tab(v-for='(week, id) in weeks' :title='`Minggu ke-${week}`' :key='`mg-${id}`')
			b-table(stacked='sm' bordered outlined small hover fixed responsive :items='items' :fields='fields')
				template( slot='pembilang' slot-scope='tgl')
					.row(v-if='editing && tgl.item.isActive' )
						.col-lg
						.col-lg-6
							b-form-input.text-center(type='number' :placeholder='JSON.stringify(tgl.item[tgl.field.key])' v-model='tgl.item[tgl.field.key]' @input='inputPembilang(tgl.item)') 
						.col-lg
					.text-center(v-else) {{tgl.item[tgl.field.key]}}
				template( slot='penyebut' slot-scope='tgl')
					.row(v-if='editing && tgl.item.isActive && tgl.item.penyebut === 0' )
						.col-lg
						.col-lg-6
							b-form-input.text-center(type='number' :placeholder='JSON.stringify(tgl.item[tgl.field.key])' v-model='tgl.item[tgl.field.key]' @input='inputPenyebut(tgl.item)') 
						.col-lg
					.text-center(v-else) {{tgl.item[tgl.field.key]}}
</template>

<script>
//import { Table } from "buefy/dist/components/table";
import bTabs from '~/node_modules/bootstrap-vue/es/components/tabs/tabs.js';
import bTab from '~/node_modules/bootstrap-vue/es/components/tabs/tab.js';

export default {
	props: ['rowitem', 'month', 'editing'],
	components: {
		bTabs,
		bTab
//    'bf-table': Table
	},
	data: () => ({
		days: [],
		pembilang: 0,
		penyebut: 0,
		weekSelected:0,
	}), 
	created(){
		let startOfMonth = this.$moment(this.month, 'MMMM YYYY').startOf("month").startOf('week');
		let endOfMonth = this.$moment(this.month, 'MMMM YYYY').endOf("month").endOf('week');
		let day = startOfMonth;
		//console.log(JSON.stringify(this.rowitem, null, 2))
		while (day <= endOfMonth) {
			this.days[this.days.length] = {
				isActive: day.format('MMMM YYYY') === this.month && day.format('dddd') !== 'Minggu' && day.isSameOrBefore(this.$moment()),
				id: this.days.length,
				hari: day.format('dddd'),
				tanggal: day.format('DD-MM-YYYY'),
				week: day.format('w'),
				pembilang: 0,
				penyebut: this.rowitem.penyebut.includes('hari') &&  day.format('MMMM YYYY') === this.month && day.format('dddd') !== 'Minggu' ? 1 : 0,
				_rowVariant: day.format('dddd') === 'Minggu' ? 'danger' : undefined
			}
			day = day.clone().add(1, "d");
		}
		let penyebut = this.days.reduce((total, item) => total + Number(item.penyebut), 0)
		if(penyebut > 0){
			this.penyebut = penyebut
		}	
	},
	methods: {
		inputPembilang(val) {
			this.days[val.id] = {...val}
			this.pembilang = this.days.reduce((total, item) => total + Number(item.pembilang), 0)
			let penyebut = this.days.reduce((total, item) => total + Number(item.penyebut), 0)
			if(penyebut > 0){
				this.penyebut = penyebut
			}
		},
		inputPenyebut(val) {
			this.days[val.id] = {...val}
			this.pembilang = this.days.reduce((total, item) => total + Number(item.pembilang), 0)
			let penyebut = this.days.reduce((total, item) => total + Number(item.penyebut), 0)
			if(penyebut > 0){
				this.penyebut = penyebut
			}
		},
		getArr() {
			let arr = []
			
			this.days.map( day => ( this.rowitem.counternames.map( (countername, id) => {
				let obj = {
					tanggal: this.$moment(day.tanggal, 'DD-MM-YYYY').toISOString(),
					countername,
					jumlah: id === 0 ? day.pembilang : day.penyebut
				}
				if(obj.jumlah > 0 ){
					arr[arr.length] = obj
					//console.log(JSON.stringify(obj, null, 2))
				}
			})))
			return arr
		}
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
		month(val){
			let day = this.startOfMonth;
			while (day <= this.endOfMonth) {
				this.days[this.days.length] = {
					isActive: day.format('MMMM YYYY') === val && day.format('dddd') !== 'Minggu',
					id: this.days.length,
					hari: day.format('dddd'),
					tanggal: day.format('DD-MM-YYYY'),
					week: day.format('w'),
					pembilang: 0,
					penyebut: this.rowitem.penyebut.includes('hari') &&  day.format('MMMM YYYY') === this.month && day.format('dddd') !== 'Minggu' ? 1 : 0,
					_rowVariant: day.format('dddd') === 'Minggu' ? 'danger' : undefined
				}
				day = day.clone().add(1, "d");
			}
		}

	},
	computed: {
		startOfMonth() {
			return this.$moment(this.month, 'MMMM YYYY').startOf("month").startOf('week');
		},
		endOfMonth() {
		 	return this.$moment(this.month, 'MMMM YYYY').endOf("month").endOf('week');
		},
		weeks() {
			let weeks = []
			let vm = this
			this.days.map( day => {
				let week = day.week
				if(weeks.indexOf(week) < 0 ) {
					if(week === vm.$moment().format('w')) {
						vm.weekSelected = weeks.length
					}
					weeks[weeks.length] = week
				}
			})
			return weeks
		},
		fields(){
			return ['hari', 'tanggal', 'pembilang', 'penyebut']
		},
		items() {
			return this.days.filter( day => day.week === this.weeks[this.weekSelected])
		}
	}
}
</script>