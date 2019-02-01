import { Table } from "buefy/dist/components/table";

export default {
  props: ['month', 'editing'],
  components: {
    'bf-table': Table
  },
  data: () => ({
    pembilang: 0,
    penyebut: 0
  }), 
  methods: {
    inputan(val) {
      let obj = JSON.parse(JSON.stringify(val));
      this[obj.hari] = 0
      Object.keys(obj).map( n => {
        if(n !== 'hari'){
          this[obj.hari] += Number(obj[n]) 
        }
      })
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
    days() {
      let startOfMonth = this.$moment(this.month, 'MMMM YYYY').startOf("month");
      let endOfMonth = this.$moment(this.month, 'MMMM YYYY').endOf("month");
      let day = startOfMonth;
      let days = []
      while (day <= endOfMonth) {
        days.push(day.format('D'))
        day = day.clone().add(1, "d");
      }
      return days
    },
    fields() {
      return ['hari', ...this.days]
    },
    hariObj() {
      let ho = {}
      this.days.map(day => ho[day] = 0)
      return ho
    },
    items() {
      return [
        Object.assign({
          'hari': 'pembilang'
        }, this.hariObj),
        Object.assign({
          'hari': 'penyebut'
        }, this.hariObj)
      ]
    }
  }
}