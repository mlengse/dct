import HarianDetail from '~/components/HarianDetail/index.vue'

export default {
  components: {
    "harian-detail": HarianDetail
  },
  props: ["row", "month"],
  data: () => ({
    editing: false,
    pembilang: 0,
    penyebut: 0,
    rincian: false
  }),
  methods: {
    toggleButton() {
      this.editing = !this.editing;
    },
    simpan() {
      this.editing = !this.editing;
    },
		rinci() {
			this.rincian = !this.rincian;
    },
    rekapHarian(val){
      this.pembilang = val.pembilang
      this.penyebut = val.penyebut
    },
	},
  computed: {
    rekap() {
      return this.pembilang / this.penyebut &&
        this.pembilang / this.penyebut !== Infinity
        ? `${((this.pembilang / this.penyebut) * 100).toFixed(1)} %`
        : this.row.item.rekap
        ? `${this.row.item.rekap.jumlah} %`
        : "0 %";
		},
		rincishow() {
			if(this.rincian){
				return 'tutup'
			}
			return 'buka'
		}
  }
};