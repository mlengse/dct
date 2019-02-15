<template lang="pug">
span.badge(:class='["badge", variant].join("-")') {{status}}
</template>

<script>
export default {
	props: ['item', 'month'],
	computed: {
	  status() {
			return this.rekap ? (this.item.operator === '>=' ? (this.rekap.jumlah >= this.item.numtarget ? 'Tercapai' : 'Belum tercapai') : (this.rekap.jumlah <= this.item.numtarget ? 'Tercapai' : 'Belum tercapai')) : 'Belum diinput'
		},
    variant() {
			return this.rekap ? (this.item.operator === '>=' ? (this.rekap.jumlah >= this.item.numtarget ? 'success' : 'danger') : (this.rekap.jumlah <= this.item.numtarget ? 'success' : 'danger')) : 'warning'
		},
		rekaps(){
			return this.item.rekaps
		},
		rekapsLength(){
			return this.rekaps.length
		},
		rekap(){
			let rekap = null
			if(this.rekapsLength){
				for(let rekapId of this.rekaps) {
					let rek = this.$store.getters['data/rekap'](rekapId)
					if(rek.periode === this.month) {
						rekap = rek
					}
				}
			}
			return rekap
		}
	}
}
</script>