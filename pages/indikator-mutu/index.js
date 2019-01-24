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
        updateMonth: async function(val) {
            if(this.month !== val) {
                this.month = val
                this.loaded = true
                await fetch(this.$store, val)
                this.loaded = false
            }
        }
    },
    computed: {
        filteredMutu() {
            return this.mutus.filter(mutu => JSON.stringify(mutu).toLowerCase().includes(this.query.toLowerCase())).map(mutu=> Object.assign( mutu, {
                _cellVariants: {
                    capaian: mutu.rekap ? (mutu.operator === '>=' ? (mutu.rekap.jumlah >= mutu.numtarget ? 'success' : 'danger') : (mutu.rekap.jumlah <= mutu.numtarget ? 'success' : 'danger')) : 'warning'
                },
                capaian: mutu.rekap ? (mutu.operator === '>=' ? (mutu.rekap.jumlah >= mutu.numtarget ? 'Tercapai' : 'Belum tercapai') : (mutu.rekap.jumlah <= mutu.numtarget ? 'Tercapai' : 'Belum tercapai')) : 'Belum diinput'                
            }))
        },
        fields() {
            return ['bagian', 'indikator', 'capaian', 'action'].map(e => ({ 
                key: e,
                sortable: true
            }))
        },
        totalRows: function() {
            return this.filteredMutu.length
        },
        mutus() {
            return this.$store.getters['mutus/list']
        }
    },
    //fetch: async ({ store }) => await fetch(store)
};