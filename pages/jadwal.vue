<template lang="pug">
.calendar.calendar-lg
  .calendar-nav.navbar
    div
      button.btn.btn-action.btn-link.btn-lg
        i.icon.icon-arrow-left(@click="gantiBulan('-1')")
    .navbar-primary 
      //button.btn(v-if='before' @click='bulanIni') sekarang : {{ sekarang }}
      | {{ bulan }}
      //button.btn(v-if='after' @click='bulanIni') sekarang: {{ sekarang }} 
    div
      button.btn.btn-action.btn-link.btn-lg(@click='gantiBulan("1")')
        i.icon.icon-arrow-right
  .calendar-container
    .calendar-header
      .calendar-date(v-for='ha of hari') {{ha}}
    .calendar-body
      .calendar-date(
        v-for='tg of tgl'
        :class="{'prev-month': tg.isPrev, 'next-month': tg.isAfter}" 
      )
        button.date-item(:class="{'date-today': tg.isNow}")  {{tg.date}}
</template>

<script>
export default {
  layout: 'none',
  data: () => ({
    bulan: '',
    hari: [],
    sekarang: '',
    before: false,
    after: false,
    tgl: []
  }),
  mounted(){
    this.hari = this.$moment.weekdays()
    this.sekarang = this.$moment().format('DD-MM-YYYY')
    this.bulan = this.$moment().format('MMMM YYYY')
  },
  watch: {
    bulan(val) {
      if(val === '') {
        this.bulan = this.$moment().format('MMMM YYYY')
        this.before = false,
        this.after = false
      }

      if(this.$moment(val, 'MMMM YYYY').isBefore(this.$moment(), 'month')) {
        this.before = true
        this.after = false
      } else if(this.$moment(val, 'MMMM YYYY').isAfter(this.$moment(), 'month')) {
        this.before = false
        this.after = true
      } else {
        this.before = false
        this.after = false
      }
      this.tgl = []
      let start = this.$moment(val, 'MMMM YYYY').startOf('month').startOf('week').add(-1, 'd')
      let end = this.$moment(val, 'MMMM YYYY').endOf('month').endOf('week').add(-1, 'd')
      while( start <= end){
        let dateNow = start.date()
        this.tgl[this.tgl.length] = {
          date: dateNow,
          isPrev: start.isBefore(this.$moment(val, 'MMMM YYYY'), 'month'),
          isNow: this.$moment(`${dateNow} ${val}`, 'DD MMMM YYYY').format('DD-MM-YYYY') == this.sekarang ? true : false,
          isAfter: start.isAfter(this.$moment(val, 'MMMM YYYY'), 'month'),
        }
        start = start.add(1, 'd')
      }
    }
  },
  methods: {
    gantiBulan(int) {
      this.bulan = this.$moment(this.bulan, 'MMMM YYYY').add(int, 'month').format('MMMM YYYY')
    },
    bulanIni() {
      this.bulan = this.$moment().format('MMMM YYYY')
    }
  }

}

</script>

<style>
@import '@/node_modules/spectre.css/docs/dist/docs.css';
@import '@/node_modules/spectre.css/dist/spectre.css';
@import '@/node_modules/spectre.css/dist/spectre-exp.css';
@import '@/node_modules/spectre.css/dist/spectre-icons.css';
</style>
