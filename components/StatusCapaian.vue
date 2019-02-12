<template lang="pug">
span.badge(:class='["badge", variant].join("-")') {{status}}
</template>

<script>
export default {
	props: ['mutu', 'month'],
	computed: {
	  status() {
			return this.rekap ? (this.mutu.operator === '>=' ? (this.rekap.jumlah >= this.mutu.numtarget ? 'Tercapai' : 'Belum tercapai') : (this.rekap.jumlah <= this.mutu.numtarget ? 'Tercapai' : 'Belum tercapai')) : 'Belum diinput'
		},
    variant() {
			return this.rekap ? (this.mutu.operator === '>=' ? (this.rekap.jumlah >= this.mutu.numtarget ? 'success' : 'danger') : (this.rekap.jumlah <= this.mutu.numtarget ? 'success' : 'danger')) : 'warning'
		},
		rekaps(){
			return this.mutu.rekaps
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
					//	console.log(rekap)
					}
				}
			}
			return rekap
		}
	}
}
</script>