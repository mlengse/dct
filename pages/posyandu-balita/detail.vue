<template lang="pug">
section.container
	.row.mt-2
		nuxt-link.btn(to="/posyandu-balita" tag='button')
			h3 Posyandu Balita 
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
								button.btn.btn-sm.btn-primary.mt-2.mr-2(type='button' @click='editBB' v-if='isLogin' :class='`${ isEdit ? `btn-success`: `btn-warning`}`') {{ isEditText }} BB dan TB
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
								template(slot='tb' slot-scope='{ item }')
									input.form-control-sm(
										v-if='isEdit'
										type="number" 
										style="width:5em"
										v-model.number='item.tb'
									)
									span(v-else) {{ item.tb || 0 }}
									span  cm
							p.col(v-else) Anda belum login. Untuk melihat data balita, silahkan masuk terlebih dahulu.
			b-tab.mt-2(title='Rekap')
			b-tab.mt-2(title='Grafik')
</template>
<script>
import mutateBalita from '~/apollo/mutate/mutateBalita.gql'
import getBalitaByPosy from '~/apollo/queries/getBalitaByPosy.gql'
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
			umur: {
				label: 'Umur',
			},
			jk: {
				label: 'JK'
			},
			bb: {
				label: 'BB'
			},
			tb: {
				label: 'TB'
			},

		}
	}),

	async mounted() {
		this.tahun = this.$moment().year()
		this.bulan = this.$moment().month()
		this.blnSelected = this.blns[this.bulan]
		this.tglSelected = this.$moment().date().toString()
		await this.$nextTick(async () => {
			await this.fetchData()
		})
	},

	watch: {
		blnSelected() {
			if(this.tgls.indexOf(this.tglSelected) < 0 ){
				this.tglSelected = 1
			}
		},
		async isLogin(val) {
			if(val) await this.fetchData(val)
		}
	},

	computed: {
		tglx(){
			return `${this.$moment(`${this.tglSelected} ${this.blnSelected} ${this.tahun}`, 'D MMMM YYYY').format('x')}`
		},
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
		balitaList() {
			return this.balita.map( e=> {
				if( !e.bb ){
					let bb = e.penimbangan.filter(a => {
						if(a){
							return a.tgl === this.tglx
						}
					})
					if (bb.length) {
						e.bb = bb[0].bb
					} else {
						e.bb = e.penimbangan.map(e => Number(e.bb)).sort()[e.penimbangan.length -1] || 0
					}
				}
				if( !e.tb ){
					let tb = e.penimbangan.filter(a => {
						if(a){
							return a.tgl === this.tglx
						}
					})
					if (tb.length) {
						e.tb = tb[0].tb
					} else {
						e.tb = e.penimbangan.map(e => Number(e.tb)).sort()[e.penimbangan.length-1] || 0
					}
				}
				return Object.assign({}, e, this.umur(e) ) 
			}).filter( e => -1 < e.thn && -1 < e.bln && -1 < e.hr && e.thn < 5)
		},
		balitaWithBB() {
			return this.balitaList.filter(e => (e.bb && e.bb > 0) || (e.tb && e.tb > 0))
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
		handleTBChange(e, item) {
			item.tb = e.target.value
		},
		async fetchData() {
			this.$nuxt.$loading.start()
			this.loaded = true
			if(this.isLogin) {
				let { data: { balita }} = await this.$apollo.query({
					query: getBalitaByPosy,
					prefetch: true,
					variables: {
						posy: `${this.posyandu._key}`
					},
					context: {
						headers: {
							token: this.$store.getters['users/idToken']
						}
					},
				})
				this.balita = balita
			}
			this.loaded = false
			this.$nuxt.$loading.finish()
		},
		editBB() {
			if(this.isEdit && this.isLogin){
				this.$nuxt.$loading.start()
				this.loaded = true
				this.balitaWithBB.map( ({ _key, bb, tb, penimbangan }) => {
					if(!penimbangan.filter(e => e && e.bb === bb).length || !penimbangan.filter(e => e && e.tb === tb).length) {
						this.$apollo.mutate({
							mutation: mutateBalita,
							variables: {
								balita: _key,
								bb,
								tb,
								tgl: this.tglx
							},
							context: {
								headers: {
									token: this.$store.getters['users/idToken']
								}
							},
							update: (store, { data: {mutateBalita: { bb, tb }} }) => {
								this.balita = this.balita.map( balita => {
									if(balita._key === _key) {
										balita.bb = bb
										balita.tb = tb
									}
									return balita
								})
							},
						})

					}
				})
				this.loaded = false
				this.$nuxt.$loading.finish()
			}
			this.isEdit = !this.isEdit
		}
	},
}
</script>
