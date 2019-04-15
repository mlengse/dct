<template lang="pug">
section.container
	.row.mt-2
		nuxt-link(to="/posyandu-balita")
			h3 Posyandu Balita 
	.row
		h5(v-if = "posyandu.name !== ''" ) {{ posyandu.name }} RW {{ posyandu.rw }}
	b-card.row.mt-2(no-body)
		b-tabs(card)
			b-tab.mt-2(title='Input')
				.btn-group.mr-2
					button.btn.btn-sm.btn-outline-primary(type='button' ) Tambah Balita
				b-card.mt-2(no-body)
					b-tabs(pills card vertical v-model='tabIndex')
						b-tab(v-for='bln in blns' :key='bln' :title='bln')
							b-table(
								small
								responsive 
								hover 
								selectable
								select-mode='single'
								stacked='sm' 
								:items="balitaList"
								:fields='fields'
							)
								template(slot='name' slot-scope='data') {{ lowerCase(data.item.name) }}
								template(slot='tl' slot-scope='data') {{ $moment(data.item.tl, 'x').format('D MMMM YYYY') }}
								template(slot='umur' slot-scope='data') {{ `${data.item.thn ? `${data.item.thn} thn ` : ''}${data.item.bln ? `${data.item.bln} bln ` : ''}${data.item.hr ? `${data.item.hr} hr` : ''}` }}

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
		tabIndex: null,
		fields: {
			//rt: {
			//	sortable: true,
			//	label: 'RT'
			//},
			name: {
				label: 'Nama',
				sortable: true,
			},
			tl: {
				sortable: true,
				label: 'Tgl Lahir',
			},
			umur: {
				label: 'Umur',
			},
			jk: {
				sortable: true,
				label: 'JK'
			},
			ortu: {
				sortable: true,
				label: 'Orang Tua'
			},
		}
	}),
	created(){
		this.tabIndex = this.$moment().month()
	},
	methods: {
		lowerCase(string) {
			return string.split(' ').map(e=> {
				return e.charAt(0) + e.slice(1).toLowerCase();
			}).join(' ')
		},
		umur(val){
			let duration = this.$moment.duration(this.$moment( `${this.$moment().format('D')}-${this.$moment(this.tabIndex+1, 'M').format('M')}-${this.$moment().format('YYYY')}`, 'D-M-YYYY' ).diff(this.$moment(val.tl, 'x')));
			return {
				thn: duration.years(),
				bln: duration.months(),
				hr: duration.days()
			}
		}
	},
	computed: {
		_key() {
			return `posy-${this.$route.params.id.toUpperCase()}`
		},
		blns(){
			return this.$moment.months()
		},
		balitaList(){
			return this.balita && this.balita.map(e=> Object.assign({}, e, {
				//rt: e.rt && e.rt.toLowerCase().includes('rt') ? e.rt.toLowerCase().split('rt').join('').trim() : e.rt
			},this.umur(e))).filter( e => e.thn < 5)
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
