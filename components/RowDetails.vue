<template lang="pug">
b-card
	b-container
		dl
			.list-group-item
				b-row(align-h='end')
					b-button-group
						b-button(size='sm' v-if='harianApplied' variant='primary' @click.stop='rinci') {{rincishow}} harian
						b-button(size='sm' v-if='editing' variant='success' @click.stop='simpan') simpan
						b-button(size='sm' v-else variant='warning' @click.stop='toggleButton') edit
			.list-group-item
				b-row
					.col-lg-2.col-md-3
						dt.text-right Pembilang
					b-col
						dd {{rowitem.pembilang}}
					b-col(cols='2')
						b-form-input.text-right(v-if='editing && !rincian' :placeholder='pembilang.toString()' v-model='pembilang')
						.text-right(v-else) {{pembilang}}
			.list-group-item
				b-row
					.col-lg-2.col-md-3
						dt.text-right Penyebut
					b-col
						dd {{rowitem.penyebut}}
					b-col(cols='2')
						b-form-input.text-right(v-if='editing && !rincian'  :placeholder='penyebut.toString()' v-model='penyebut')
						.text-right(v-else) {{penyebut}}
	harian-detail(v-if='rincian' :month='month' :editing='editing' @rekapHarian='rekapHarian')
	b-container.mt-3
		.list-group
			.list-group-item
				b-row
					b-col.text-right Capaian
					b-col(cols='2') {{rekap}} 
			.list-group-item
				b-row
					b-col.text-right Target
					b-col(cols='2') {{row.item.target}}

</template>

<script>
import HarianDetail from '~/components/HarianDetail.vue'

export default {
  components: {
    "harian-detail": HarianDetail
  },
  props: ["row", "month"],
  data: () => ({
    editing: false,
    pembilang: 0,
    penyebut: 0,
    rincian: false,
    rowRekap: null,
  }),
  methods: {
    toggleButton() {
      this.isAuth ? this.editing = !this.editing : this.$store.commit('users/openLogin')
    },
    async simpan() {
      let vm = this
      this.isAuth ? this.editing = !this.editing : this.$store.commit('users/openLogin')
      this.$nuxt.$loading.start()
     // this.$toast.show('Simpan rekap')
      try {
        this.rowRekap && await Promise.all([
          this.$store.dispatch('data/sendRekap', {
            rekap: this.rowRekap
          }),
          this.desc.map( async des => {
            await vm.$store.dispatch('data/sendCounter', {
              counter: {
                jumlah: Number(vm[des.type]),
                waktu: vm.$moment(vm.month, 'MMMM YYYY').toISOString(),
                countername: {
                  _id: des._id
                }
              }
            })
          })
        ])
       // this.$toast.success('Rekap tersimpan')
        this.$nuxt.$loading.finish()

      } catch(err){
       // this.$toast.error('simpan gagal')
        this.$nuxt.$loading.finish()

      }

    },
		rinci() {
			this.rincian = !this.rincian;
    },
    rekapHarian(val){
      this.pembilang = val.pembilang
      this.penyebut = val.penyebut
    },
  },
  watch: {
    rekap(val) {
      let row = JSON.parse(JSON.stringify(this.rowitem))
      row.rekap = {
        periode: this.month,
        jumlah: Number(val.split(' ')[0]),
        indicator: {
          _id: row._id
        }
      }
      this.rowRekap = row.rekap
    }
  },
  mounted(){
    if (this.rowitem.penyebut == Number(this.rowitem.penyebut)) {
      this.penyebut = this.rowitem.penyebut
    }
  },
  computed: {
    rekap() {
      return this.pembilang / this.penyebut &&
        this.pembilang / this.penyebut !== Infinity
        ? `${((this.pembilang / this.penyebut) * 100).toFixed(1)} %`
        : this.rowitemrekap
        ? `${this.rowitemrekap.jumlah} %`
        : "0 %";
    },
    harianApplied() {
      return this.rowitem.penyebut.includes('hari') || this.rowitem.penyebut.includes('pasien')
    },
		rincishow() {
			if(this.rincian){
				return 'tutup'
			}
			return 'buka'
    },
    rowitemrekap(){
      let rekap = null
      if (this.rowitem.rekaps.length) {
        for (let rekapId of this.rowitem.rekaps) {
          let rek = this.$store.getters['data/rekap'](rekapId)
          if (rek.periode === this.month) {
            rekap = rek
          }
        }
      }
      return rekap
    },
    rowitem(){
      let vm = this
      let rowitem = this.row.item
      for(let des of this.desc) {
        rowitem[des.type] = des.name
        des.counters.length && des.counters.map( counterId => {
          let counter = vm.$store.getters['data/counter'](counterId) || vm.$store.dispatch('data/counter', {vm, counterId})
          if(counter){
            if(vm.$moment(counter.waktu, vm.$moment.ISO_8601).format('MMMM YYYY') === vm.month){
              vm[des.type] = Number(counter.jumlah)
            }
          } 
        })
      }
      return rowitem
    },
    desc(){
      return this.row.item.counternames.map(counternameId => this.$store.getters['data/countername'](counternameId))
    },
    isAuth(){
      return this.$store.getters['users/isAuthenticated']
    }
  }
};
</script>