<template lang="pug">
section.container
	.row.mt-2
		nuxt-link(to="/posyandu-balita")
			h3.col Posyandu Balita 
	.row
		h5.col(v-if = "posyandu && posyandu.name !== ''" ) {{ posyandu.name }} RW {{ posyandu.rw }}
	b-card.row.mt-2(no-body)
		b-tabs(card)
			b-tab.mt-2(title='Input')
				.card.mt-2
					.card-header
						h5 Bulan penimbangan: {{blnSelected}} {{tahun}}
					.card-body
						.row
							.col-sm.mt-2
								b-input-group(prepend='Tanggal' size='sm')
									b-form-select(v-model='tglSelected' :options='tgls' size='sm')
							.col-sm.mt-2
								b-input-group(prepend='Bulan' size='sm')
									b-form-select(v-model='blnSelected' :options='blns' size='sm')
							.col-sm.mt-2
								b-input-group(prepend='Tahun' size='sm')
									b-form-select(v-model='tahun' :options='thns' size='sm')
						.row
							.col
								button.btn.btn-sm.btn-primary.mt-2.mr-2(type='button' @click='editBB' v-if='isLogin' :class='`${ isEdit ? `btn-success`: `btn-warning`}`') {{ isEditText }} BB
						.row
							.col
								input.col.form-control.mt-2(v-model='query' type='text' placeholder='Search...')

						.row.mt-2
							b-table(
								small
								v-if='isLogin'
								responsive 
								hover 
								selectable
								select-mode='single'
								stacked='sm' 
								:filter= 'query'
								:items="balitaList"
								:busy.sync='loaded' 
								:fields='fields'
							)
								template(slot='name' slot-scope='{ item: {name}}') {{ lowerCase(name) }}
								//template(slot='tl' slot-scope='data') {{ $moment(data.item.tl, 'x').format('D MMMM YYYY') }}
								template(slot='jk' slot-scope='{ item: { jk } }') {{ `${jk === 'L' ? 'Laki-laki' : 'Perempuan'} `}}
								template(slot='umur' slot-scope='{ item: { thn, bln, hr }}') {{ `${thn ? `${thn} thn ` : ''}${bln ? `${bln} bln ` : ''}${hr ? `${hr} hr` : ''}` }}
								template(slot='bb' slot-scope='{ item }')
									input.form-control-sm(
										v-if='isEdit'
										type="number" 
										style="width:5em"
										v-model.number='item.bb'
									)
									span(v-else) {{ item.bb || 0 }}
									span  kg
							p.col(v-else) Anda belum login. Untuk melihat data balita, silahkan masuk terlebih dahulu.
			b-tab.mt-2(title='Rekap')
			b-tab.mt-2(title='Grafik')
</template>
<script>
import posyById from '~/apollo/queries/getPosyanduById.gql'
import mutateBalita from '~/apollo/mutate/mutateBalita.gql'
import getBalitaByPosy from '~/apollo/queries/getBalitaByPosy.gql'
import getBalitaByBB from '~/apollo/queries/getBalitaBB.gql'
export default {
	components: {
		bInputGroup: () => import('~/node_modules/bootstrap-vue/es/components/input-group/input-group'),
		bFormSelect: () => import('~/node_modules/bootstrap-vue/es/components/form-select/form-select'),
		BCard: () => import('~/node_modules/bootstrap-vue/es/components/card/card'),
		BTabs: () => import('~/node_modules/bootstrap-vue/es/components/tabs/tabs'),
		BTab: () => import('~/node_modules/bootstrap-vue/es/components/tabs/tab'),
		BTable: () => import('~/node_modules/bootstrap-vue/es/components/table/table'),
	},

	data: () => ({
		query: '',
		isEdit: false,
		loaded: false,
		balita: [],
		inputPenimbangan: false,
		tglSelected: null,
		bulan: null,
		blnSelected: null,
		tahun: null,
		fields: {
			name: {
				label: 'Nama',
			},
			//tl: {
			//	label: 'TL',
			//},
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

	async mounted() {
		this.tahun = this.$moment().year()
		this.bulan = this.$moment().month()
		this.blnSelected = this.blns[this.bulan]
		this.tglSelected = this.$moment().date().toString()
		await this.$nextTick(async () => {
			this.$nuxt.$loading.start()
			this.loaded = true
			let { data: { balita }} = await this.$apollo.query({
				query: getBalitaByPosy,
				prefetch: true,
				variables: {
					posy: `${this.posyandu._key}`
				}
			})
			this.balita = balita.map(e => {
				let bb = e.penimbangan.filter(a => {
					if(a){
						return a.tgl === `${this.$moment(`${this.tglSelected} ${this.blnSelected} ${this.tahun}`, 'D MMMM YYYY').format('x')}`
					}
				})
				if (bb.length) {
					e.bb = bb[0].bb
				}
				return e
			})
/*			
			balita.map(async e => {
				let { data: { balitaBB }} = await this.$apollo.query({
					query: getBalitaByBB,
					variables: {
						_key: `${e._key}-${this.$moment(`${this.tglSelected} ${this.blnSelected} ${this.tahun}`, 'D MMMM YYYY').format('x')}`						
					}
				})
				if(balitaBB) {
					e.bb = balitaBB.bb
				}
				this.balita.push(e)
			})
*/
			this.loaded = false
			this.$nuxt.$loading.finish()
		})
	},

	watch: {
		blnSelected() {
			if(this.tgls.indexOf(this.tglSelected) < 0 ){
				this.tglSelected = 1
			}
		}
	},

	computed: {
		posyandu(){
			return {
				_key: this.$route.query._key,
				name: this.$route.query.name,
				rw: this.$route.query.rw
			}
		},
		isEditText(){
			if(this.isEdit){
				return 'Simpan'
			} 
			return 'Input'
		},
		isLogin() {
			return this.$store.getters['users/isAuthenticated']
		},
		thns() {
			return [ this.$moment(this.tahun, 'YYYY').add(-1, 'y').format('YYYY'), this.tahun, this.$moment(this.tahun, 'YYYY').add(1, 'y').format('YYYY')]
		},
		blns(){
			return this.$moment.months()
		},
		tgls(){
			let tgls = []
      let start = this.$moment(`${this.blnSelected} ${this.tahun}`, 'MMMM YYYY').startOf('month')
      let end = this.$moment(`${this.blnSelected} ${this.tahun}`, 'MMMM YYYY').endOf('month')
      while( start <= end){
        let dateNow = start.date()
        tgls[tgls.length] = dateNow.toString()
        start = start.add(1, 'd')
      }
			return tgls
		},
		balitaList(){
			return this.balita && this.balita.map(e=> Object.assign({}, e, {
				//rt: e.rt && e.rt.toLowerCase().includes('rt') ? e.rt.toLowerCase().split('rt').join('').trim() : e.rt
			},this.umur(e))).filter( e => -1 < e.thn && -1 < e.bln && -1 < e.hr && e.thn < 5)
		},
		balitaWithBB() {
			return this.balitaList.filter(e => e.bb && e.bb > 0)
		}
	},

	methods: {
		lowerCase(string) {
			return string.split(' ').map(e=> {
				return e.charAt(0) + e.slice(1).toLowerCase();
			}).join(' ')
		},
		umur(val){
			let duration = this.$moment.duration(this.$moment( `${this.tglSelected}-${this.blnSelected}-${this.tahun}`, 'D-MMMM-YYYY' ).diff(this.$moment(val.tl, 'x')));
			return {
				thn: duration.years(),
				bln: duration.months(),
				hr: duration.days()
			}
		},
		handleBBChange(e, item) {
			item.bb = e.target.value
		},
		editBB() {
			if(this.isEdit){
				this.balitaWithBB.map( ({ _key, bb, penimbangan }) => {
					if(!penimbangan.filter(e => e && e.bb === bb).length) {
						this.$apollo.mutate({
							mutation: mutateBalita,
							variables: {
								balita: _key,
								bb,
								tgl: `${this.$moment(`${this.tglSelected} ${this.blnSelected} ${this.tahun}`, 'D MMMM YYYY').format('x')}`
							},
							update: (store, { data: {mutateBalita: {bb}} }) => {
								this.balita = this.balita.map( balita => {
									if(balita._key === _key) {
										balita.bb = bb
									}
									return balita
								})
								// Read the data from our cache for this query.
								//const data = store.readQuery({ query: TAGS_QUERY })
								// Add our tag from the mutation to the end
								//data.tags.push(addTag)
								// Write our data back to the cache.
								//store.writeQuery({ query: TAGS_QUERY, data })
							},
						})

					}
				})
			}
			this.isEdit = !this.isEdit
		}
	},
}
</script>
