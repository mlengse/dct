<template lang="pug">
section.container
	b-modal(ref='datepicker')
		template(slot='modal-header')
			button.btn.btn-sm.btn-primary(type='button' @click='changeMonth(-1)') &lsaquo; &lsaquo;
			h5 {{ $moment(balita.tl, "D MMMM YYYY").format("MMMM YYYY") }}
			button.btn.btn-sm.btn-primary(type='button' @click='changeMonth(1)') &rsaquo; &rsaquo;
		template(slot='default')
			date-picker(:tgl='balita.tl' @update='updatetl')
	no-ssr
		b-modal(ref='balita' :title='`${modal.title} Balita`' :ok-title='okTitle' @ok='simpan' cancel-title='Batal')
			label Nama:
			b-form-input(v-if='okTitle == "Simpan"' v-model='balita.name')
			p(v-else) {{ balita.name }}
			label Jenis Kelamin:
			p(v-if='okTitle == "Simpan"' )
				b-form-radio-group(v-model='balita.jk' :options='jkOptions' buttons button-variant="outline-primary")
			p(v-else) {{ balita.jk === 'L' ? 'Laki-laki' : 'Perempuan' }}
			label Tanggal Lahir:
			p {{ balita.tl }}
				button.ml-2.btn.btn-primary.btn-sm(v-if='okTitle == "Simpan"' type='button' @click='$refs["datepicker"].show()') Pilih Tanggal
			label Orang Tua: 
			b-form-input(v-if='okTitle == "Simpan"' v-model='balita.ortu')
			p(v-else) {{ balita.ortu }}
			label RT:
			b-form-input(v-if='okTitle == "Simpan"' v-model='balita.rt')
			p(v-else) {{ balita.rt }}

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
						.btn-toolbar(v-if='isLogin')
							button.btn.btn-sm.btn-primary.mt-2.mr-2(type='button' @click='editBalita("Tambah")') Tambah Balita
							button.btn.btn-sm.mt-2.mr-2(type='button' @click='editBB' :class='`${ isEdit ? `btn-success`: `btn-warning`}`') {{ isEditText }} BB dan TB
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
								@row-clicked='(item) => editBalita("Lihat", item)'
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
import vBModal from '~/node_modules/bootstrap-vue/es/directives/modal/modal.js'
import mutateBalitaBB from '~/apollo/mutate/mutateBalitaBB.gql'
import mutateBalita from '~/apollo/mutate/mutateBalita.gql'
import getBalitaByPosy from '~/apollo/queries/getBalitaByPosy.gql'
export default {
	components: {
		DatePicker: () => import('~/components/DatePicker.vue'),
		bInputGroup: () => import('~/node_modules/bootstrap-vue/es/components/input-group/input-group'),
		bFormSelect: () => import('~/node_modules/bootstrap-vue/es/components/form-select/form-select'),
		BFormInput: () => import('~/node_modules/bootstrap-vue/es/components/form-input/form-input'),
		BFormRadioGroup: () => import('~/node_modules/bootstrap-vue/es/components/form-radio/form-radio-group'),
		BCard: () => import('~/node_modules/bootstrap-vue/es/components/card/card'),
		BTabs: () => import('~/node_modules/bootstrap-vue/es/components/tabs/tabs'),
		BTab: () => import('~/node_modules/bootstrap-vue/es/components/tabs/tab'),
		BTable: () => import('~/node_modules/bootstrap-vue/es/components/table/table'),
		'b-modal': () => import("~/node_modules/bootstrap-vue/es/components/modal/modal.js")
	},

	directives: {
		'b-modal': vBModal
	},

	data: () => ({
		showDatePicker: false,
		query: '',
		isEdit: false,
		loaded: false,
		balitas: [],
		jkOptions: [
			{ 
				text: 'Laki-laki',
				value: 'L'
			}, {
				text: 'Perempuan',
				value: 'P'
			}
		],
		balitaOld: null,
		balita: {
			name: '',
			jk: '',
			ortu: '',
			tl: '',
			rt: '',
			gakin: false,
			posy: ''
		},
		modal: {
			title: ''
		},
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
		isLogin(val) {
			if(val) this.fetchData(val)
		}
	},

	computed: {
		okTitle(){
			return `${this.modal.title === "Lihat" ? "Edit" : "Simpan"}`
		},
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
			return this.balitas.map( e=> {
				let penimbangan = e.penimbangan.filter( e => this.$moment(e.tgl, 'x').format('M YYYY') === this.$moment(this.tglx, 'x').format('M YYYY'))
				e.bb = penimbangan
				.map(e => Number(e.bb))
				.sort()[penimbangan.length -1] || 0

				e.tb = penimbangan
				.map(e => Number(e.tb))
				.sort()[penimbangan.length-1] || 0
				return Object.assign({}, e, this.umur(e) ) 
			}).filter( e => -1 < e.thn && -1 < e.bln && -1 < e.hr && e.thn < 5)
		},
		balitaWithBB() {
			return this.balitaList
				.filter(e => (e.bb && e.bb > 0 && e.bb !== e.penimbangan
					.filter( e => this.$moment(e.tgl, 'x').format('M YYYY') === this.$moment(this.tglx, 'x').format('M YYYY'))
					.map(e => Number(e.bb))
					.sort()[e.penimbangan.length -1]) 
					|| (e.tb && e.tb > 0 && e.tb !== e.penimbangan
					.filter( e => this.$moment(e.tgl, 'x').format('M YYYY') === this.$moment(this.tglx, 'x').format('M YYYY'))
					.map(e => Number(e.tb))
					.sort()[e.penimbangan.length -1]))
		}
	},

	methods: {
		changeMonth(val){
			this.balita.tl = this.$moment(this.balita.tl, 'D MMMM YYYY').add( val, 'month').format('D MMMM YYYY')
		},
		updatetl(val){
			this.balita.tl = val
		},
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
				this.balitas = balita
			}
			this.loaded = false
			this.$nuxt.$loading.finish()
		},
		editBalita(title, balita){
			this.modal = {
				title,
			}
			
			this.balita = {
				name: balita ? balita.name : '',
				tl: balita ? this.$moment(balita.tl, 'x').format('D MMMM YYYY') : this.$moment().format('D MMMM YYYY'),
				ortu: balita ? balita.ortu : '',
				jk: balita ? balita.jk : '',
				rt: balita ? balita.rt : '',
				gakin: balita ? balita.gakin : ''
			}
			this.balitaOld = Object.assign({}, this.balita)
			this.$refs['balita'].show()
		},
		simpan(ev){
			if(this.modal.title === 'Lihat') {
				this.modal.title = 'Edit'
				ev.preventDefault()
			} else {
				this.modal.title = 'Lihat'
				ev.preventDefault()
				if(this.balita.name && this.balita.name !== ''){
					let variables = {
						_key: `balita-${this.balita.name.split(' ').join('-').toUpperCase()}-${this.$moment(this.balita.tl, 'D MMMM YYYY').format('x')}-${this.balita.jk}`, 
						name: this.balita.name.toUpperCase(), 
						gakin: `${!!this.balita.gakin}`, 
						jk: this.balita.jk, 
						tl: this.$moment(this.balita.tl, 'D MMMM YYYY').format('x'), 
						ortu: this.balita.ortu.toUpperCase(), 
						rt: this.balita.rt, 
						rw: this.posyandu.rw, 
						posy: this.posyandu._key
					}
					if (JSON.stringify(this.balitaOld) !== JSON.stringify(this.balita)) {
						this.$nuxt.$loading.start()
						this.loaded = true
						this.$apollo.mutate({
							mutation: mutateBalita,
							variables,
							context: {
								headers: {
									token: this.$store.getters['users/idToken']
								}
							},
							update: (store, { data: {mutateBalita} }) => {
								let data = store.readQuery({ 
									query: getBalitaByPosy,
									variables: {
										posy: `${this.posyandu._key}`
									},
								})

								if(data.balita.filter(e=> e._key === variables._key).length){
									if(JSON.stringify((data.balita[data.balita.map(e=>e._key).indexOf(variables._key)])) !== JSON.stringify(mutateBalita)) {
										data.balita[data.balita.map(e=>e._key).indexOf(variables._key)] = mutateBalita
										store.writeQuery({ query: getBalitaByPosy, data })
									}
								} else {
									data.balita.push(mutateBalita)
									store.writeQuery({ query: getBalitaByPosy, data })
								}
								this.loaded = false
								this.$nuxt.$loading.finish()
							},
						})

					}
				}
			}
		},
		editBB() {
			if(this.isEdit && this.isLogin){
				this.$nuxt.$loading.start()
				this.loaded = true
				this.balitaWithBB.map( ({ _key, bb, tb, penimbangan }) => {
					this.$apollo.mutate({
						mutation: mutateBalitaBB,
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
						update: (store, { data: {mutateBalitaBB: { bb, tb }} }) => {
							const data = store.readQuery({ query: getBalitaByPosy })
							data.balita = data.balita.map( balita => {
								if(balita._key === _key) {
									balita.bb = bb
									balita.tb = tb
								}
								return balita
							})
							store.writeQuery({ query: getBalitaByPosy, data })
						},
					})
				})
				this.loaded = false
				this.$nuxt.$loading.finish()
			}
			this.isEdit = !this.isEdit
		}
	},
}
</script>
