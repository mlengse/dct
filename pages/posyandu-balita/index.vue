<template lang="pug">
section.container
	.row.mt-2
		h3.col Posyandu Balita
	.row
		.col-md-12
			.form-group.mt-2
				input.form-control(v-model='query' type='text' placeholder='Search...')
	.btn-toolbar
		button.btn.btn-primary.btn-sm.mt-2.mr-2 Tambah Posyandu
	.row
		.col.mt-2
			b-list-group
				b-list-group-item(v-for='menu in odd' :key='menu._key') 
					button.btn.btn-primary.btn-sm.mr-2(@click='click(menu)') Lihat 
					button.btn.btn-sm.btn-outline-warning.mr-2(@click='edit(menu)') Edit
					button.btn(@click='click(menu)') {{ menu.name }} RW {{ menu.rw }}
		.col.mt-2
			b-list-group
				b-list-group-item(v-for='menu in even' :key='menu._key' )
					button.btn.btn-primary.btn-sm.mr-2(@click='click(menu)') Lihat
					button.btn.btn-sm.btn-outline-warning.mr-2(@click='edit(menu)') Edit
					button.btn(@click='click(menu)') {{ menu.name }} RW {{ menu.rw }}
</template>

<script>
import getPosyanduGql from '~/apollo/queries/getPosyandu.gql'

export default {
	components: {
		BListGroup: () => import('~/node_modules/bootstrap-vue/es/components/list-group/list-group'),
		BListGroupItem: () => import('~/node_modules/bootstrap-vue/es/components/list-group/list-group-item')
	},
	
	data: () => ({
		query: '',
		items: []
	}),

	apollo: {
		items: {
			query: getPosyanduGql,
			prefetch: true,
			update({ getPosyanduList }) {
				return getPosyanduList
			}
		}
	},

	async mounted() {
		await this.$nextTick(async ()=>{
			this.$nuxt.$loading.start()
		})
	},

	watch: {
		items(val){
			this.$nuxt.$loading.finish()
		}
	},

	methods: {
		edit(menu){
			console.log(menu)
		},
		click(menu) {
			this.$router.push(`/posyandu-balita/detail?_key=${menu._key}&name=${menu.name}&rw=${menu.rw}`)
		}
	},
	
	computed: {
		odd(){
			return this.filteredList.filter( (e, i) => (i+2)%2 == 0)
		},
		even(){
			return this.filteredList.filter( (e, i) => (i+2)%2 !== 0)
		},
		filteredList() {
			return this.items.filter( item => JSON.stringify(item).toLowerCase().includes(this.query.toLowerCase()))
		},
	},

}
</script>

