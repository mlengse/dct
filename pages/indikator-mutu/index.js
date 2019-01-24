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
        query: "",
        perPage: 5,
        currentPage: 1,
        loaded: false
    }),
    methods: {
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
    },
    computed: {
        filteredMutu() {
            return this.mutus.filter(mutu => JSON.stringify(mutu).toLowerCase().includes(this.query.toLowerCase())).map(mutu=> Object.assign( mutu, {
                capaian: mutu.rekap ? (mutu.operator === '>=' ? (mutu.rekap.jumlah >= mutu.numtarget ? 'Tercapai' : 'Belum tercapai') : (mutu.rekap.jumlah <= mutu.numtarget ? 'Tercapai' : 'Belum tercapai')) : 'Belum diinput',
                varian: mutu.rekap ? (mutu.operator === '>=' ? (mutu.rekap.jumlah >= mutu.numtarget ? 'success' : 'danger') : (mutu.rekap.jumlah <= mutu.numtarget ? 'success' : 'danger')) : 'warning',
            }))
        },
        fields: () => ['bagian', 'indikator', 'capaian', 'action'].map(e => ({ 
            key: e,
            sortable: true
        })),
        totalRows() {
            return this.filteredMutu.length
        },
        mutus() {
            return this.$store.getters['mutus/list']
        }
    },
    //fetch: async ({ store }) => await fetch(store)
};