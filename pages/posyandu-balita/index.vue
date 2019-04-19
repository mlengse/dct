<template lang="pug">
section.container
	.row.mt-2
		h3 Posyandu Balita
	.row.mt-2
		.col-md-12
			.form-group.mt-3
				input.form-control(v-model='query' type='text' placeholder='Search...')
	no-ssr
		.row.mt-2.fluid
			b-table(
				small
				responsive 
				hover 
				selectable
				select-mode='single'
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
				@row-selected='rowSelected'
			)
		.row.mt-2
		.col-md-12
			b-pagination(:total-rows="totalRows" :per-page="perPage" v-model="currentPage")
</template>

<script>
import getPosyanduGql from '~/apollo/queries/getPosyandu.gql'
export default {
	components: {
		BTable: () => import('~/node_modules/bootstrap-vue/es/components/table/table'),
		BPagination: () => import('~/node_modules/bootstrap-vue/es/components/pagination/pagination')
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
			},
			rw: {
				label: 'RW',
			},
		},
		items: []
	}),
	mounted() {
		this.$nextTick(()=>{
			this.$nuxt.$loading.start()
			this.loaded = true
			this.$apollo.query({
				query: getPosyanduGql,
				prefetch: true,
			}).then(({data: { getPosyanduList }}) => {
				this.items = getPosyanduList
				this.loaded = false
				this.$nuxt.$loading.finish()
			})
		})
	},
	watch: {
		items(val) {
			this.totalRows = val.length
		},
	},
	methods: {
		lowerCase(string) {
			return string.split(' ').map(e=> {
				return e.charAt(0) + e.slice(1).toLowerCase();
			}).join(' ')
		},
		onFiltered(filteredItems) {
			this.totalRows = filteredItems.length
			this.currentPage = 1
		},
		rowSelected(items){
			this.$router.push(`/posyandu-balita/detail?id=${items[0].rw.toLowerCase().split(' ').join('-')}`)
		}
	},
}
</script>

