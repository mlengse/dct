<template lang="pug">
section.container
	.row.mt-2
		h3 Posyandu Balita 
	.row
		h5(v-if = "() => posyandu.name !== ''" ) {{ lowerCase(posyandu.name) }} RW {{ posyandu.rw }}
	b-card.row.mt-2(no-body)
		b-tabs(card)
			b-tab.mt-2(title='Input')
				b-table(
					small
					responsive 
					hover 
					selectable
					select-mode='single'
					stacked='sm' 
					:items="balitaList"
				)

			b-tab.mt-2(title='Rekap')
			b-tab.mt-2(title='Grafik')
</template>
<script>
import BTable from '~/node_modules/bootstrap-vue/es/components/table/table'
import BPagination from '~/node_modules/bootstrap-vue/es/components/pagination/pagination'
import BCard from '~/node_modules/bootstrap-vue/es/components/card/card'
import BTabs from '~/node_modules/bootstrap-vue/es/components/tabs/tabs'
import BTab from '~/node_modules/bootstrap-vue/es/components/tabs/tab'
import posyById from '~/apollo/queries/getPosyanduById.gql'
import getBalitaByPosy from '~/apollo/queries/getBalitaByPosy.gql'
export default {
	components: {
		BCard,
		BTabs,
		BTab,
		BTable,
		BPagination
	},
	data: () => ({
		posyandu: {
			name: '',
			rw: ''
		},
	}),
	methods: {
		lowerCase(string) {
			return string.split(' ').map(e=> {
				return e.charAt(0) + e.slice(1).toLowerCase();
			}).join(' ')
		},
	},
	computed: {
		_key() {
			return `posy-${this.$route.params.id.toUpperCase()}`
		},
		balitaList(){
			return this.balita && this.balita.map(e=> Object.assign({}, e, {
				name: this.lowerCase(e.name),
			}))
		}
	},
	

	apollo: {
		posyandu: {
			query: posyById,
			variables() {
				return {
					id: this._key
				}
			},
			update: ({ posyandu }) => posyandu
		},
		balita: {
			query: getBalitaByPosy,
			variables() {
				return {
					posy: this._key
				}
			},
			update: ({ balita }) => balita
		},
	}

}
</script>
