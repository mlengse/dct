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
				sortable: true
			},
		},
	}),
	apollo: {
		items: {
			query: getPosyanduGql,
			update({getPosyanduList}){
				return getPosyanduList.map( posy => Object.assign(
					{}, 
					posy, 
					{
						name: this.lowerCase(posy.name)
					}
				))
			}
		}
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
			this.$router.push(`/posyandu-balita/${items[0].rw.toLowerCase().split(' ').join('-')}`)
		}
	},
}
</script>

