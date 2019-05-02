<template lang="pug">
b-modal(v-model='showModal')
	template(slot='modal-header')
		button.btn.btn-sm.btn-primary(type='button' @click='changeMonth(-1)') &lsaquo; &lsaquo;
		h5 {{ $moment(tanggal, "D MMMM YYYY").format("MMMM YYYY") }}
		button.btn.btn-sm.btn-primary(type='button' @click='changeMonth(1)') &rsaquo; &rsaquo;
	template(slot='default')
		.container-fluid
			.row
				.col(v-for='h in hari') 
					p {{ h }}
			.row(v-for='w in week')
				button.col.btn.btn-sm(v-for='t in getdays(w)' type='button' @click='setTgl(t.tgl)' :class='t.class') {{ t.date }}

</template>

<script>
import vBModal from '~/node_modules/bootstrap-vue/es/directives/modal/modal.js'

export default {
	components: {
		'b-modal': () => import("~/node_modules/bootstrap-vue/es/components/modal/modal.js")
	},

	directives: {
		'b-modal': vBModal
	},

	mounted(){
		this.tanggal = this.tgl || this.$moment().format('D MMMM YYYY')
	},
	
	props: ['tgl', 'show'],
	data: () => ({
		showModal: false,
		tanggal: '',
	}),
	watch: {
		show(n){
			if(n) {
				this.showModal = true
			}
		},
		showModal(n) {
			if(!n) {
				this.$emit('closeDatePicker')
			}
		},
		tgl(n){
			if(n){
				this.tanggal = n
			} else {
				this.tanggal = this.$moment().format('D MMMM YYYY')
			}
		},
	},
	methods: {
		changeMonth(val){
			this.tanggal = this.$moment(this.tanggal, 'D MMMM YYYY').add( val, 'month').format('D MMMM YYYY')
		},

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
				let date = {
					date: dateNow,
					tgl: start.format('D MMMM YYYY'),
					isPrev: start.isBefore(this.$moment(this.tanggal, 'D MMMM YYYY'), 'month'),
					isNow: start.format('D MMMM YYYY') === this.tanggal,
					isAfter: start.isAfter(this.$moment(this.tanggal, 'D MMMM YYYY'), 'month'),
					week: Math.floor(tgl.length / 7),
					isMinggu: start.day() == 0
				}
				date = Object.assign({}, date, {
					class: `${date.isNow ? `btn-outline-primary` : ``}${date.isMinggu ? ` text-danger` : `${date.isAfter || date.isPrev ? ` text-secondary`: ``}`}`
				})
				tgl[tgl.length] = date
				start = start.add(1, 'd')
			}
			return tgl
		},
		week(){
			return [...new Set(this.tgls.map(e=>e.week))]
		},
	},
}
</script>