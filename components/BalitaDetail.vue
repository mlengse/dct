<template lang="pug">
div
  no-ssr
    date-picker(:tgl='balita.tl' @update='updatetl' :show='showDatePicker' @closeDatePicker='showDatePicker = false')
    b-modal(ref='balita' :title='`${modal.title} Balita`')
      template(slot='default')
        label Nama:
        b-form-input(v-if='okTitle == "Simpan"' v-model='balita.name')
        p(v-else) {{ balita.name }}
        label Jenis Kelamin:
        p(v-if='okTitle == "Simpan"' )
          b-form-radio-group(v-model='balita.jk' :options='jkOptions' buttons button-variant="outline-primary")
        p(v-else) {{ balita.jk === 'L' ? 'Laki-laki' : 'Perempuan' }}
        label Tanggal Lahir:
        p {{ balita.tl }}
          button.ml-2.btn.btn-primary.btn-sm(v-if='okTitle == "Simpan"' type='button' @click='showDatePicker = true') Pilih Tanggal
        label Orang Tua: 
        b-form-input(v-if='okTitle == "Simpan"' v-model='balita.ortu')
        p(v-else) {{ balita.ortu }}
        label RT:
        b-form-input(v-if='okTitle == "Simpan"' v-model='balita.rt')
        p(v-else) {{ balita.rt }}
      template(slot='modal-footer')
        button.btn.btn-sm.btn-secondary(type='button' @click='batal') {{ tutup }}
        button.btn.btn-sm.btn-danger(v-if='balita.name' type='button') Hapus
        button.btn.btn-sm(v-if='balita.name' type='button' @click='simpan' :class='okclass') {{ okTitle }}

</template>

<script>
import vBModal from '~/node_modules/bootstrap-vue/es/directives/modal/modal.js'
import mutateBalita from '~/apollo/mutate/mutateBalita.gql'

export default {
  components: {
		DatePicker: () => import('~/components/DatePicker.vue'),
		'b-modal': () => import("~/node_modules/bootstrap-vue/es/components/modal/modal.js"),
		BFormInput: () => import('~/node_modules/bootstrap-vue/es/components/form-input/form-input'),
		BFormRadioGroup: () => import('~/node_modules/bootstrap-vue/es/components/form-radio/form-radio-group'),

  },
  props: ['data'],
  directives: {
		'b-modal': vBModal
	},
  data: () => ({
		showDatePicker: false,
		jkOptions: [
			{ 
				text: 'Laki-laki',
				value: 'L'
			}, {
				text: 'Perempuan',
				value: 'P'
			}
    ],
    posyandu: null,
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
    
  }),
  watch: {
    data(data){
      if(data){
        let { balita, title, posyandu} = data
        this.modal.title = title
        this.posyandu = posyandu
        this.balita = Object.assign({}, balita, {
          name: balita ? balita.name : '',
          tl: balita ? this.$moment(balita.tl, 'x').format('D MMMM YYYY') : this.$moment().format('D MMMM YYYY'),
          ortu: balita ? balita.ortu : '',
          jk: balita ? balita.jk : '',
          rt: balita ? balita.rt : '',
          gakin: balita ? balita.gakin : ''
        })
        this.balitaOld = Object.assign({}, this.balita)
        this.$refs['balita'].show()

      }
    }
  },
  methods: {
    updatetl(val){
			this.balita.tl = val
    },
    batal(ev){
			if(this.modal.title === 'Edit') {
				this.modal.title = 'Lihat'
			} else {
        this.$refs['balita'].hide()
      }
    },

    simpan(ev){
			if(this.modal.title === 'Lihat') {
				this.modal.title = 'Edit'
			} else {
				this.modal.title = 'Lihat'
				if(this.balita.name && this.balita.name !== ''){
					let variables = {
						_key: this.balita._key || `balita-${this.balita.name.split(' ').join('-').toUpperCase()}-${this.$moment(this.balita.tl, 'D MMMM YYYY').format('x')}-${this.balita.jk}`, 
						name: this.balita.name.toUpperCase(), 
						gakin: `${!!this.balita.gakin}`, 
						jk: this.balita.jk, 
						tl: this.$moment(this.balita.tl, 'D MMMM YYYY').format('x'), 
						ortu: this.balita.ortu.toUpperCase(), 
						rt: this.balita.rt, 
						rw: this.posyandu.rw, 
            posy: this.posyandu._key,
            inactive: this.balita.inactive || false
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
                this.balita = Object.assign({}, mutateBalita, {
                  tl: this.$moment(mutateBalita.tl, 'x').format('D MMMM YYYY')
                })
                this.balitaOld = Object.assign({}, this.balita)
                this.$emit('change', {variables, mutateBalita})
                this.$nuxt.$loading.finish()
                this.loaded = false
							},
						})

          }
          
				}
      }
      
		},

  },
  computed: {
    tutup(){
			return `${this.modal.title === "Lihat" ? "Tutup" : "Kembali"}`
		},
    okTitle(){
			return `${this.modal.title === "Lihat" ? "Edit" : "Simpan"}`
		},
    okclass(){
			return `${this.modal.title === "Lihat" ? "btn-warning" : "btn-success"}`
		},

  },

}
</script>
