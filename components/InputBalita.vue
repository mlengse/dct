<template lang="pug">
.card.mt-2
  balita-detail(:data='balita' @change='balitaChange')
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
  
</template>

<script>
import getBalitaByPosy from '~/apollo/queries/getBalitaByPosy.gql'
import mutateBalitaBB from '~/apollo/mutate/mutateBalitaBB.gql'

export default {
  components: {
		BalitaDetail: () => import('~/components/BalitaDetail.vue'),
		bInputGroup: () => import('~/node_modules/bootstrap-vue/es/components/input-group/input-group'),
		bFormSelect: () => import('~/node_modules/bootstrap-vue/es/components/form-select/form-select'),
		BTable: () => import('~/node_modules/bootstrap-vue/es/components/table/table'),

  },

  data: () => ({
		inputPenimbangan: false,
		query: '',
		blnSelected: null,
		tahun: null,
		bulan: null,
		tglSelected: null,
		loaded: false,
		balitas: [],
		balita: null,
		isEdit: false,
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

  computed: {
    posyandu(){
			return {
				_key: this.$route.query._key,
				name: this.$route.query.name,
				rw: this.$route.query.rw
			}
		},

    thns() {
			return [ this.$moment(this.tahun, 'YYYY').add(-1, 'y').format('YYYY'), this.tahun, this.$moment(this.tahun, 'YYYY').add(1, 'y').format('YYYY')]
		},
    blns(){
			return this.$moment.months()
		},
		tglx(){
			return `${this.$moment(`${this.tglSelected} ${this.blnSelected} ${this.tahun}`, 'D MMMM YYYY').format('x')}`
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
    isEditText(){
			if(this.isEdit){
				return 'Simpan'
			} 
			return 'Input'
		},

		isLogin() {
			return this.$store.getters['users/isAuthenticated']
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
			}).filter( e => -1 < e.thn && -1 < e.bln && -1 < e.hr && e.thn < 5).sort((a, b) =>{
				if( b.thn - a.thn === 0 ){
					if(b.bln - a.bln === 0){
						if(b.hr - a.hr === 0) {
							return 1
						} else {
							return b.hr - a.hr
						}
					} else {
						return b.bln - a.bln
					}
				} else {
					return b.thn - a.thn
				}
			})
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
  
  methods: {
		lowerCase(string) {
			return string.split(' ').map(e=> {
				return e.charAt(0) + e.slice(1).toLowerCase();
			}).join(' ')
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
			this.balita = {
				title,
				balita,
				posyandu: this.posyandu
			}
			
		},

    balitaChange({ variables, mutateBalita }) {
			if(this.balitas.filter(e=> e._key === variables._key).length){
				if(JSON.stringify((this.balitas[this.balitas.map(e=>e._key).indexOf(variables._key)])) !== JSON.stringify(mutateBalita)) {
					this.balitas = this.balitas.map(e => {
						if(e._key === variables._key) {
							e = Object.assign({}, mutateBalita)
						}
						return e
					})
				}
			} else {
				this.balitas.push(mutateBalita)
			}
		},
		umur(val){
			let duration = this.$moment.duration(this.$moment( `${this.tglSelected}-${this.blnSelected}-${this.tahun}`, 'D-MMMM-YYYY' ).diff(this.$moment(val.tl, 'x')));
			return {
				thn: duration.years(),
				bln: duration.months(),
				hr: duration.days()
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
							const data = store.readQuery({ 
								query: getBalitaByPosy, 
								variables: {
									posy: `${this.posyandu._key}`
								},
							})
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
<style>
input[type="number"]::-webkit-outer-spin-button, input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
 
input[type="number"] {
    -moz-appearance: textfield;
}
</style>
