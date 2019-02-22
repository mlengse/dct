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
import BCard from '~/node_modules/bootstrap-vue/es/components/card/card';
import BTable from '~/node_modules/bootstrap-vue/es/components/table/table'

export default {
	props: ['row', 'editing'],
	components: {
		bTabs,
		bTab,
		BCard,
		BTable
	},
	data: () => ({
		days: [],
		weekSelected:0,
	}), 
	methods: {
		inputPembilang(val) {
			this.days[val.id] = val
			this.row.item.pembilang.jumlah = this.row.item.days.reduce((total, day) => total + Number(day.pembilang.jumlah), 0)
			let penyebut = this.row.item.days.reduce((total, day) => total + Number(day.penyebut.jumlah), 0)
			if(penyebut > 0){
				this.row.item.penyebut.jumlah = penyebut
			}
		},
		inputPenyebut(val) {
			this.days[val.id] = val
			this.row.item.pembilang.jumlah = this.row.item.days.reduce((total, day) => total + Number(day.pembilang.jumlah), 0)
			let penyebut = this.row.item.days.reduce((total, day) => total + Number(day.penyebut.jumlah), 0)
			if(penyebut > 0){
				this.row.item.penyebut.jumlah = penyebut
			}
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
			return this.row.item.days.filter( day => day.week === this.weeks[this.weekSelected])
		},
	}
}
</script>