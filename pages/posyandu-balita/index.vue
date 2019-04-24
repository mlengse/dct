<template lang="pug">
section.container
	.row.mt-2
		h3.col Posyandu Balita
	.row
		.col-md-12
			.form-group.mt-2
				input.form-control(v-model='query' type='text' placeholder='Search...')
	.btn-toolbar
		button.btn.btn-primary.btn-sm.mt-2.mr-2(@click='editPosyandu("Tambah")') Tambah Posyandu
	.row
		.col.mt-2
			b-list-group
				b-list-group-item(v-for='menu in odd' :key='menu._key') 
					button.btn.btn-primary.btn-sm.mr-2(@click='click(menu)') Lihat 
					button.btn.btn-sm.btn-outline-warning.mr-2(v-if='isLogin' @click='editPosyandu("Edit", menu)') Edit
					button.btn(@click='click(menu)') {{ menu.name }} RW {{ menu.rw }}
		.col.mt-2
			b-list-group
				b-list-group-item(v-for='menu in even' :key='menu._key' )
					button.btn.btn-primary.btn-sm.mr-2(@click='click(menu)') Lihat
					button.btn.btn-sm.btn-outline-warning.mr-2(v-if='isLogin' @click='editPosyandu("Edit", menu)') Edit
					button.btn(@click='click(menu)') {{ menu.name }} RW {{ menu.rw }}
	b-modal(ref='modal-1' :title='`${modal.title} Posyandu`' ok-title='Simpan' @ok='simpan' cancel-title='Batal')
		label Nama:
		b-form-input(v-model='posy.name')
		label.mt-2 RW:
		b-form-input(v-model='posy.rw') 
</template>

<script>
import getPosyanduGql from '~/apollo/queries/getPosyandu.gql'
import mutatePosyGql from '~/apollo/mutate/mutatePosy.gql'
import vBModal from '~/node_modules/bootstrap-vue/es/directives/modal/modal.js'

export default {
	components: {
		BListGroup: () => import('~/node_modules/bootstrap-vue/es/components/list-group/list-group'),
		BFormGroup: () => import('~/node_modules/bootstrap-vue/es/components/form-group/form-group'),
		BFormInput: () => import('~/node_modules/bootstrap-vue/es/components/form-input/form-input'),
		BListGroupItem: () => import('~/node_modules/bootstrap-vue/es/components/list-group/list-group-item'),
		'b-modal': () => import("~/node_modules/bootstrap-vue/es/components/modal/modal.js")
	},

	directives: {
		'b-modal': vBModal
	},
	
	data: () => ({
		query: '',
		items: [],
		modal: {
			title: '',
		},
		posy:	{
			name: '',
			rw: ''
		}
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
			if(val && Array.isArray(val) && val.length ) {
				this.$nuxt.$loading.finish()
			}
		}
	},

	methods: {
		simpan(){
			if(this.isLogin && this.posy.name !== ''){
				this.$nuxt.$loading.start()
				this.$apollo.mutate({
					mutation: mutatePosyGql,
					variables: Object.assign({}, this.posy, {
						_key: `posy-${this.posy.rw.split(' ').join('-').toUpperCase()}`,
					}),
					context: {
						headers: {
							token: this.$store.getters['users/idToken']
						}
					},
					update: (store, { data: {mutatePosy}} ) => {
						const data = store.readQuery({ query: getPosyanduGql })
						let ex = data.getPosyanduList.filter(e => e._key === mutatePosy._key)
						if(ex && ex.length) {
							data.getPosyanduList.map( e => {
								if(e._key === mutatePosy._key) {
									return Object.assign(e, mutatePosy)
								} 
								return e
							})
						} else {
							data.getPosyanduList.push(mutatePosy)
						}
						store.writeQuery({ query: getPosyanduGql, data })
					},
				})
				this.$nuxt.$loading.finish()
			}
		},
		editPosyandu(title, posy){
			if(!this.isLogin) {
				this.$store.commit('users/openLogin')
			} else {
				this.modal = {
					title,
				}
				this.posy = Object.assign({
					name: '',
					rw: ''
				}, posy )
				this.$refs['modal-1'].show()

			}
		},
		click(menu) {
			this.$router.push(`/posyandu-balita/detail?_key=${menu._key}&name=${menu.name}&rw=${menu.rw}`)
		}
	},
	
	computed: {
		isLogin() {
			return this.$store.getters['users/isAuthenticated']
		},

		odd(){
			return this.filteredList.filter( (e, i) => (i+2)%2 == 0)
		},
		even(){
			return this.filteredList.filter( (e, i) => (i+2)%2 !== 0)
		},
		filteredList() {
			return this.items.filter( item => JSON.stringify(item).toLowerCase().includes(this.query.toLowerCase())).sort( (a, b) => Number(a.rw.split(' ')[0]) - Number(b.rw.split(' ')[0])).map(e => ({
				name: e.name.toUpperCase(),
				rw: e.rw.toUpperCase(),
				_key: e._key
			}))
		},
	},

}
</script>

