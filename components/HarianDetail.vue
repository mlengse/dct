<template lang="pug">
b-card(noBody)
	b-tabs(small card v-model='weekSelected')
		b-tab(v-for='(week, id) in weeks' :title='`Minggu ke-${week}`' :key='`mg-${id}`')
			b-table(stacked='sm' bordered outlined small hover fixed responsive :items='items' :fields='fields')
				template( slot='pembilang' slot-scope='tgl')
					.row(v-if='editing && tgl.item.isActive' )
						.col-lg
						.col-lg-6
							b-form-input.text-center(type='number' :placeholder='tgl.item[tgl.field.key] ? tgl.item[tgl.field.key].jumlah ? tgl.item[tgl.field.key].jumlah.toString() : "0" : "0"' v-model='tgl.item[tgl.field.key].jumlah' @input='inputPembilang') 
						.col-lg
					.text-center(v-else) {{tgl.item[tgl.field.key].jumlah || 0}}
				template( slot='penyebut' slot-scope='tgl')
					.row(v-if="editing && tgl.item.isActive && tgl.item.penyebut.jumlah !== 1" )
						.col-lg
						.col-lg-6
							b-form-input.text-center(type='number' :placeholder='tgl.item[tgl.field.key] ? tgl.item[tgl.field.key].jumlah ? tgl.item[tgl.field.key].jumlah.toString() : "0" : "0"' v-model='tgl.item[tgl.field.key].jumlah' @input='inputPenyebut') 
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
			this.days[val.id] = {...val}
			this.pembilang = this.days.reduce((total, item) => total + Number(item.pembilang.jumlah), 0)
			let penyebut = this.days.reduce((total, item) => total + Number(item.penyebut.jumlah), 0)
			if(penyebut > 0){
				this.penyebut = penyebut
			}
		},
		inputPenyebut(val) {
			this.days[val.id] = {...val}
			this.pembilang = this.days.reduce((total, item) => total + Number(item.pembilang.jumlah), 0)
			let penyebut = this.days.reduce((total, item) => total + Number(item.penyebut.jumlah), 0)
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
	},
	computed: {
		getArr() {
			let arr = []
			
			return arr
		},
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
				dayObj.pembilang = {
					...this.row.item.pembilang,
					...this.$store.getters['harian/gettgl']({
						name: this.row.item.pembilang.name,
						tanggal: dayObj.tanggal
					})
				}
				dayObj.penyebut = {
					...this.row.item.penyebut,
					...this.$store.getters['harian/gettgl']({
						name: this.row.item.penyebut.name,
						tanggal: dayObj.tanggal
					})
				}
				return dayObj
			})
		}
	}
}
</script>