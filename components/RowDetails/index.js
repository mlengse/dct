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
      this.isAuth ? this.editing = !this.editing : this.$store.commit('users/openLogin')
    },
    simpan() {
      this.isAuth ? this.editing = !this.editing : this.$store.commit('users/openLogin')
    },
		rinci() {
			this.rincian = !this.rincian;
    },
    rekapHarian(val){
      this.pembilang = val.pembilang
      this.penyebut = val.penyebut
    },
  },
  mounted(){
    if (this.row.item.penyebut == Number(this.row.item.penyebut)) {
      this.penyebut = this.row.item.penyebut
    }
    this.penyebut = 0
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
    harianApplied() {
      return this.row.item.penyebut.includes('hari') || this.row.item.penyebut.includes('pasien')
    },
		rincishow() {
			if(this.rincian){
				return 'tutup'
			}
			return 'buka'
    },
    isAuth(){
      return this.$store.getters['users/isAuthenticated']
    }
  }
};