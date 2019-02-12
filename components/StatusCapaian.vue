<template lang="pug">
span.badge(:class='["badge", variant].join("-")') {{status}}
//--
	span.tag(:class='["is", variant].join("-")') {{status}}
//
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
		rekap(){
			//console.log(JSON.stringify(this.mutu, null, 2))
			let rekap = null
			if(this.mutu.rekaps.length){
				for(let rekapId of this.mutu.rekaps) {
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

<!--style lang="sass" scoped>
@import "~/node_modules/bulma/sass/utilities/_all.sass"
@import "~/node_modules/bulma/sass/elements/tag.sass"
</style-->
