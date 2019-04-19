<template lang="pug">
section.container
	.row.mt-2
		h3 Posyandu Balita
	.row.mt-2
		.col-md-12
			.form-group.mt-3
				input.form-control(v-model='query' type='text' placeholder='Search...')
	no-ssr
		.row.mt-2
			.col
				b-list-group
					b-list-group-item(v-for='menu in odd' :key='menu._key' button @click='click(menu)') {{ menu.name }} RW {{ menu.rw }}
			.col
				b-list-group
					b-list-group-item(v-for='menu in even' :key='menu._key' button @click='click(menu)') {{ menu.name }} RW {{ menu.rw }}
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

	mounted() {
		this.$nextTick(async ()=>{
			this.$nuxt.$loading.start()
			await this.$apollo.query({
				query: getPosyanduGql,
				prefetch: true,
			}).then(({data: { getPosyanduList }}) => {
				this.items = getPosyanduList
				return
			})
			this.$nuxt.$loading.finish()

		})
	},

	methods: {
		click(menu) {
			this.$router.push(`/posyandu-balita/detail?id=${menu.rw.toLowerCase().split(' ').join('-')}`)
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
			if(this.items.length){
				return this.items.filter( item => JSON.stringify(item).toLowerCase().includes(this.query.toLowerCase()))
			}
			return []
		},
	},

}
</script>

