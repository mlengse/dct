import MonthPicker from '~/components/MonthPicker/index.vue'
import fetch from './fetch'

export default {
    components: {
        MonthPicker
    },
    data: () => ({
        month: '',
        sortBy: null,
        sortDesc: false,
        query: null,
        perPage: 5,
        currentPage: 1,
        loaded: false,
        totalRows: 0,
        modalInfo: { title: '', content: '' }
   }),
    methods: {
        onFiltered(filteredItems) {
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        async updateMonth(val) {
            if(this.month !== val) {
                this.month = val
                this.loaded = true
                this.$nuxt.$loading.start()
                await fetch(this.$store, val)
                this.$nuxt.$loading.finish()
                this.loaded = false
            }
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
        mutus() {
            this.totalRows = this.mutus.length
        }
    },
    computed: {
        fields: () => ['bagian', 'indikator', 'capaian', 'action'].map(e => ({ 
            key: e,
            sortable: true
        })),
        mutus() {
            return this.$store.getters['mutus/list'].map(mutu => Object.assign(mutu, {
                capaian: mutu.rekap ? (mutu.operator === '>=' ? (mutu.rekap.jumlah >= mutu.numtarget ? 'Tercapai' : 'Belum tercapai') : (mutu.rekap.jumlah <= mutu.numtarget ? 'Tercapai' : 'Belum tercapai')) : 'Belum diinput',
                varian: mutu.rekap ? (mutu.operator === '>=' ? (mutu.rekap.jumlah >= mutu.numtarget ? 'success' : 'danger') : (mutu.rekap.jumlah <= mutu.numtarget ? 'success' : 'danger')) : 'warning',
                detailsShowing: false
            }))

        }
    }
};