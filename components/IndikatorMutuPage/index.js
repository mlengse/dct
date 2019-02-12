import MonthPicker from '~/components/MonthPicker.vue'
import RowDetails from '~/components/RowDetails.vue'
import StatusCapaian from '~/components/StatusCapaian.vue'
//import BTable from "~/node_modules/bootstrap-vue/es/components/table/table";

export default {
  props:[
    'month',
    'loaded'
  ],
  components: {
    //'b-table': BTable,
    StatusCapaian,
    MonthPicker,
    RowDetails
  },
  data: () => ({
    sortBy: null,
    sortDesc: false,
    query: null,
    perPage: 10,
    currentPage: 1,
    totalRows: 0,
    modalInfo: { title: '', content: '' }
  }),
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    updateMonth(val) {
      if (this.month !== val) {
        this.$emit('updateMonth', val)
      }
    },
    showing(row) {
      return row._showDetails
    },
    info(item, index, button) {
      this.modalInfo.title = `Row index: ${index}`
      this.modalInfo.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    resetModal() {
      this.modalInfo.title = ''
      this.modalInfo.content = ''
    }
  },
  watch: {
    mutus(val) {
      this.totalRows = val.length
    }
  },
  computed: {
    fields: () => ['bagian', 'indikator', 'capaian', 'action'].map(e => ({
      key: e,
      sortable: true
    })),
    mutus() {
      return this.$store.getters['data/mutus'].map(mutu => ({
        ...mutu,
        _showDetails: mutu._showDetails || false,
      }))
    }
  }
};