<template lang="pug">
section.container
	.row.mt-2
		h3 Posyandu Balita
	.row.mt-2
		.col-md-12
			.form-group.mt-3
				input.form-control(v-model='query' type='text' placeholder='Search...')
	.row.mt-2.fluid
		b-table(
			small
			responsive 
			hover 
			stacked='sm' 
			:busy.sync='loaded' 
			:items="items"
			:fields='fields' 
			:filter='query'
			:current-page="currentPage" 
			:per-page="perPage" 
			:sort-by.sync="sortBy" 
			:sort-desc.sync="sortDesc" 
			@filtered='onFiltered'
		)
	.row.mt-2
		.col-md-12
			b-pagination(:total-rows="totalRows" :per-page="perPage" v-model="currentPage")
</template>

<script>
import BTable from '~/node_modules/bootstrap-vue/es/components/table/table'
import BPagination from '~/node_modules/bootstrap-vue/es/components/pagination/pagination'
import getPosyanduGql from '~/apollo/queries/getPosyandu.gql'
export default {
	components: {
		BTable,
		BPagination
	},
	data: () => ({
		loaded: false,
		query: null,
		sortBy: null,
		sortDesc: false,
		perPage: 10,
		currentPage: 1,
		totalRows: 0,
 		fields:{
			name: {
				label: 'Nama',
				sortable: true
			},
			rw: {
				label: 'RW',
			},
		},
	}),
	apollo: {
		items: {
			query: getPosyanduGql,
			update({getPosyandu}){
				return getPosyandu
			}
		}
	},
	/*
	async beforeMount(){
		await this.$nextTick( async () => {
			this.$nuxt.$loading.start()
			this.loaded = true
			await this.$store.dispatch('posyandu-balita/all')
			this.loaded = false
			this.$nuxt.$loading.finish()
		})
	},
	
	computed: {
		items() {
			return []
		}
	},
	*/
	watch: {
		items(val) {
			this.totalRows = val.length
		},
	},
	methods: {
		onFiltered(filteredItems) {
			this.totalRows = filteredItems.length
			this.currentPage = 1
		},
	},
}
</script>

<!--style>
@import	"@/node_modules/bootstrap/dist/css/bootstrap.css";
@import	"@/node_modules/bootstrap-vue/dist/bootstrap-vue.css";
</style--!>
