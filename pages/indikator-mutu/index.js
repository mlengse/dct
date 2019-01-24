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
            return this.mutus.filter(mutu => JSON.stringify(mutu).toLowerCase().includes(this.query.toLowerCase()))
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
    fetch: async ({ store }) => await fetch(store)
};