<template lang="pug">
b-card(noBody)
  b-tabs(card v-model='weekSelected')
    b-tab(v-for='(week, id) in weeks' :title='`Minggu ke-${week}`' :key='`mg-${id}`')
      b-table(stacked='md' bordered outlined small hover fixed responsive :items='items' :fields='fields')
        template( slot='pembilang' slot-scope='tgl')
          b-form-input.text-right(v-if='editing && tgl.item.isActive' :placeholder='JSON.stringify(tgl.item[tgl.field.key] || 0)' v-model='tgl.item[tgl.field.key]' @input='inputan(tgl.item)') 
          div(v-else) {{tgl.item[tgl.field.key]}}
        template( slot='penyebut' slot-scope='tgl')
          b-form-input.text-right(v-if='editing && tgl.item.isActive' :placeholder='JSON.stringify(tgl.item[tgl.field.key] || 0)' v-model='tgl.item[tgl.field.key]' @input='inputan(tgl.item)') 
          div(v-else) {{tgl.item[tgl.field.key]}}
</template>

<script>
//import { Table } from "buefy/dist/components/table";
import bTabs from '~/node_modules/bootstrap-vue/es/components/tabs/tabs.js';
import bTab from '~/node_modules/bootstrap-vue/es/components/tabs/tab.js';

export default {
  props: ['month', 'editing'],
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
  created(){
    let startOfMonth = this.$moment(this.month, 'MMMM YYYY').startOf("month").startOf('week');
    let endOfMonth = this.$moment(this.month, 'MMMM YYYY').endOf("month").endOf('week');
    let day = startOfMonth;
    while (day <= endOfMonth) {
      this.days[this.days.length] = {
        isActive: day.format('MMMM YYYY') === this.month,
        id: this.days.length,
        hari: day.format('dddd'),
        tanggal: day.format('DD-MM-YYYY'),
        week: day.format('w'),
        pembilang: 0,
        penyebut: 0,
        _rowVariant: day.format('dddd') === 'Minggu' ? 'danger' : undefined
      }
      day = day.clone().add(1, "d");
    }
  },
  methods: {
    inputan(val) {
      let obj = JSON.parse(JSON.stringify(val));
      this.days[obj.id] = obj
      this.pembilang = this.days.reduce((total, item) => total + Number(item.pembilang), 0)
      this.penyebut = this.days.reduce((total, item) => total + Number(item.penyebut), 0)
    }
  },
  watch: {
    pembilang(val){
      this.$emit('rekapHarian', {
        pembilang: this.pembilang,
        penyebut: this.penyebut
      })
    },
    penyebut(val) {
      this.$emit('rekapHarian', {
        pembilang: this.pembilang,
        penyebut: this.penyebut
      })
    }
  },
  computed: {
    weeks() {
      let weeks = []
      this.days.map( day => {
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
      return this.days.filter( day => day.week === this.weeks[this.weekSelected])
    }
  }
}
</script>