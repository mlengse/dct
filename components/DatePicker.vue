<template lang="pug">
.container-fluid
	.row
		.col(v-for='h in hari') 
			p {{ h }}
	.row(v-for='w in week')
		button.col.btn.btn-sm(v-for='t in getdays(w)' type='button' @click='setTgl(t.tgl)') {{ t.date }}
</template>

<script>

export default {
	mounted(){
		this.tanggal = this.tgl || this.$moment().format('D MMMM YYYY')
	},
	props: ['tgl'],
	data: () => ({
		tanggal: '',
	}),
	watch: {
		tgl(n){
			if(n){
				this.tanggal = n
			} else {
				this.tanggal = this.$moment().format('D MMMM YYYY')
			}
		},
	},
	methods: {
		getdays(week){
			return this.tgls.filter(e=> e.week === week)      
		},
		setTgl(tgl){
			this.$emit('update', tgl)
		}
	},
	computed: {
		hari(){
			return this.$moment.weekdaysMin()
		},
		tgls(){
			let tgl = []
			let start = this.$moment(this.tanggal, 'D MMMM YYYY').startOf('month').startOf('week').add(-1, 'd')
			let end = this.$moment(this.tanggal, 'D MMMM YYYY').endOf('month').endOf('week').add(-1, 'd')
			while( start <= end){
				let dateNow = start.date()
				tgl[tgl.length] = {
					date: dateNow,
					tgl: start.format('D MMMM YYYY'),
					isPrev: start.isBefore(this.$moment(this.tanggal, 'D MMMM YYYY'), 'month'),
					isAfter: start.isAfter(this.$moment(this.tanggal, 'D MMMM YYYY'), 'month'),
					week: Math.floor(tgl.length / 7) 
				}
				start = start.add(1, 'd')
			}
			return tgl
		},
		week(){
			return [...new Set(this.tgls.map(e=>e.week))]
		}
	},
}
</script>