<template lang="pug">
b-card(noBody)
	b-tabs(small card v-model='weekSelected')
		b-tab(v-for='(week, id) in weeks' :title='`Minggu ke-${week}`' :key='`mg-${id}`')
			b-table(stacked='sm' bordered outlined small hover fixed responsive :items='items' :fields='fields')
				template( slot='pembilang' slot-scope='tgl')
					.row(v-if='editing && tgl.item.isActive' )
						.col-lg
						.col-lg-6
							b-form-input.text-center(type='number' :placeholder='tgl.item[tgl.field.key].jml.toString()' v-model='tgl.item[tgl.field.key].jml' @input='inputPembilang') 
						.col-lg
					.text-center(v-else) {{tgl.item[tgl.field.key].jml}}
				template( slot='penyebut' slot-scope='tgl')
					.row(v-if="editing && tgl.item.isActive && tgl.item.penyebut !== 1" )
						.col-lg
						.col-lg-6
							b-form-input.text-center(type='number' :placeholder='tgl.item[tgl.field.key].jml.toString()' v-model='tgl.item[tgl.field.key].jml' @input='inputPenyebut') 
						.col-lg
					.text-center(v-else) {{tgl.item[tgl.field.key].jml}}
</template>

<script>
//import { Table } from "buefy/dist/components/table";
import bTabs from '~/node_modules/bootstrap-vue/es/components/tabs/tabs.js';
import bTab from '~/node_modules/bootstrap-vue/es/components/tabs/tab.js';

export default {
	props: ['rowitem', 'month', 'editing', 'desc'],
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
	async created(){
		let day = this.startOfMonth;
		while (day <= this.endOfMonth) {
			let dayObj = {
				isActive: day.format('MMMM YYYY') === this.month && day.format('dddd') !== 'Minggu' && day.isSameOrBefore(this.$moment()),
				id: this.days.length,
				hari: day.format('dddd'),
				tanggal: day.format('DD-MM-YYYY'),
				week: day.format('w'),
				pembilang: 0,
				penyebut: this.rowitem.penyebut.includes('hari') &&  day.format('MMMM YYYY') === this.month && day.format('dddd') !== 'Minggu' ? 1 : 0,
				_rowVariant: day.format('dddd') === 'Minggu' ? 'danger' : undefined
			}
			this.days[this.days.length] = dayObj

			day = day.clone().add(1, "d");

		}
		let penyebutNum = this.days.reduce((total, item) => total + Number(item.penyebut), 0)
		if(penyebutNum > 0){
			this.penyebut = penyebutNum
		}	
		for( let dayObj of this.days ) {
			for(let des of this.desc) {
				dayObj[des.type] = {
					jml: dayObj[des.type],
					_id: des._id,
					name: des.name
				}
			}
			//console.log(JSON.stringify(dayObj, null, 2))
			//des[this.$moment(res.waktu, this.$moment.ISO_8601).format('MMMM YYYY')] = res
		}

		let pembilang = {
			id: this.desc.map(({_id}) => _id)[0],
		}
		let tglPembilang = this.days.filter(day => day.pembilang._id === pembilang.id).map( ({tanggal})=> tanggal).flat()
		pembilang = {
			...pembilang,
			from: this.$moment(tglPembilang[0], 'DD-MM-YYYY').toISOString(),
			to: this.$moment(tglPembilang[tglPembilang.length-1], 'DD-MM-YYYY').toISOString()
		}
		
		let penyebut = {
			id: this.desc.map(({_id}) => _id)[1],
		}
		let tglPenyebut = this.days.filter(day => day.penyebut._id === penyebut.id).map( ({tanggal})=> tanggal).flat()
		penyebut = {
			...penyebut,
			from: this.$moment(tglPenyebut[0], 'DD-MM-YYYY').toISOString(),
			to: this.$moment(tglPenyebut[tglPenyebut.length-1], 'DD-MM-YYYY').toISOString()
		}

		await this.$store.dispatch('harian/counterTimeName', { pembilang, penyebut })
	},
	methods: {
		inputPembilang(val) {
//			console.log(JSON.stringify(val, null, 2))
			this.days[val.id] = {...val}
	//		console.log(JSON.stringify(this.days, null, 2))
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
	},
	watch: {
		pembilang(val){
			this.$emit('rekapHarian', {
				pembilang: this.pembilang,
				penyebut: this.penyebut,
				arr: this.getArr
			})
		},
		penyebut(val) {
			this.$emit('rekapHarian', {
				pembilang: this.pembilang,
				penyebut: this.penyebut,
				arr: this.getArr
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
		getArr() {
			let arr = []
			
			this.allDays.map( day => ( this.rowitem.counternames.map( (countername, id) => {
				let obj = {
					waktu: this.$moment(day.tanggal, 'DD-MM-YYYY').add(1, 'second').toISOString(),
					countername: {
						_id: countername
					},
					jumlah: id === 0 ? Number(day.pembilang) : Number(day.penyebut)
				}
				if(obj.jumlah > 0 ){
					arr[arr.length] = obj
				}
			})))
			//console.log(arr.length)
			return arr
		},
		startOfMonth() {
			return this.$moment(this.month, 'MMMM YYYY').startOf("month")//.startOf('week');
		},
		endOfMonth() {
			 return this.$moment(this.month, 'MMMM YYYY').endOf("month")//.endOf('week');
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
			return this.allDays.filter( day => day.week === this.weeks[this.weekSelected])
		},
		
		allDays(){
			return this.days.map( dayObj => {
				for(let i = 0; i< this.desc.length; i++){
					let des = this.desc[i]
					if(des.counters.length) for( let a = 0; a< des.counters.length; a++){
						//here!!!
					}
				}
				return dayObj
			})
		}
	}
}
</script>