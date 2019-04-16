<template lang="pug">
section.container
	.row.mt-2
		nuxt-link(to="/posyandu-balita")
			h3 Posyandu Balita 
	.row
		h5(v-if = "posyandu && posyandu.name !== ''" ) {{ posyandu.name }} RW {{ posyandu.rw }}
	b-card.row.mt-2(no-body)
		b-tabs(card)
			b-tab.mt-2(title='Input')
				.card.mt-2
					.card-header
						h5 Bulan penimbangan: {{blnSelected}} {{tahun}}
					.card-body
						.row
							b-input-group(prepend='Tanggal' size='sm')
								.btn.btn-sm.btn-outline-dark(slot='prepend') {{tglSelected}}
								b-input-group-text(slot='prepend' size='sm') Bulan
								b-form-select(v-model='blnSelected' :options='blns' size='sm')
								b-input-group-text(slot='append' size='sm') Tahun
								button.btn.btn-sm.btn-primary(slot='append' type='button' @click='changeYear(-1)') &lsaquo;
								.btn.btn-sm.btn-outline-dark.disabled(slot='append') {{tahun}}
								button.btn.btn-sm.btn-primary(slot='append' type='button' @click='changeYear(1)') &rsaquo;
						b-table.mt-2(
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
import bInputGroupText from '~/node_modules/bootstrap-vue/es/components/input-group/input-group-text';
import bInputGroup from '~/node_modules/bootstrap-vue/es/components/input-group/input-group';
import bFormSelect from '~/node_modules/bootstrap-vue/es/components/form-select/form-select';
//import bFormInput from '~/node_modules/bootstrap-vue/es/components/form-input/form-input';

import BTable from '~/node_modules/bootstrap-vue/es/components/table/table'
import BPagination from '~/node_modules/bootstrap-vue/es/components/pagination/pagination'
import BCard from '~/node_modules/bootstrap-vue/es/components/card/card'
import BTabs from '~/node_modules/bootstrap-vue/es/components/tabs/tabs'
import BTab from '~/node_modules/bootstrap-vue/es/components/tabs/tab'
import posyById from '~/apollo/queries/getPosyanduById.gql'
import getBalitaByPosy from '~/apollo/queries/getBalitaByPosy.gql'
export default {
	components: {
		bInputGroupText,
		bInputGroup,
		bFormSelect,
	//	bFormInput,
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
		inputPenimbangan: false,
		tglSelected: null,
		bulan: null,
		blnSelected: null,
		tahun: null,
		fields: {
			//rt: {
			//	sortable: true,
			//	label: 'RT'
			//},
			name: {
				label: 'Nama',
			},
			umur: {
				label: 'Umur',
			},
			jk: {
				label: 'JK'
			},
			bb: {
				label: 'Berat'
			}
		}
	}),
	created(){
		this.tahun = this.$moment().year()
		this.bulan = this.$moment().month()
		this.blnSelected = this.blns[this.bulan]
		this.tglSelected = this.$moment().date()
	},
	methods: {
		changeYear(val){
			this.tahun = this.$moment(this.tahun, 'YYYY').add(val, 'y').format('YYYY')
		},
		lowerCase(string) {
			return string.split(' ').map(e=> {
				return e.charAt(0) + e.slice(1).toLowerCase();
			}).join(' ')
		},
		umur(val){
			let duration = this.$moment.duration(this.$moment( `${this.$moment().format('D')}-${this.$moment(this.blns.indexOf(this.blnSelected)+1, 'M').format('M')}-${this.tahun}`, 'D-M-YYYY' ).diff(this.$moment(val.tl, 'x')));
			return {
				thn: duration.years(),
				bln: duration.months(),
				hr: duration.days()
			}
		}
	},
	computed: {
		_key() {
			if(this.$route.query.id){
				return `posy-${this.$route.query.id.toUpperCase()}`
			} else {
				return ''
			}
		},
		blns(){
			return this.$moment.months()
		},
		balitaList(){
			return this.balita && this.balita.map(e=> Object.assign({}, e, {
				//rt: e.rt && e.rt.toLowerCase().includes('rt') ? e.rt.toLowerCase().split('rt').join('').trim() : e.rt
			},this.umur(e))).filter( e => -1 < e.thn && -1 < e.bln && -1 < e.hr && e.thn < 5)
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
