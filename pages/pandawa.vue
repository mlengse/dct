<template lang="pug">
section.container
	.row
		.col
			h4  Pandawa
			h5  (Pendaftaran via Whatsapp)
	.row
		.col
			.alert.alert-warning.alert-dismissible.fade.show(v-if="alert" role="alert")
				p
					strong Perhatian! 
				p Setelah mengisi form berikut, Anda akan diarahkan ke web Whatsapp (jika membuka via web browser) atau aplikasi Whatsapp di perangkat Anda.
				button.close(type="button" data-dismiss="alert" aria-label="Close" @click="hide")
					span(aria-hidden="true") &times;
	.card
		.card-body
			.row
				.col-md.mt-2
					b-input-group(prepend='Hari')
						b-form-select(v-model='hariSelected' :options='hari')
				.col-md.mt-2
					b-input-group(prepend='Poli tujuan')
						b-form-select(v-model='poliSelected' :options='poli')
			.row
				.col-md.mt-2
					b-input-group
						b-dropdown(slot="prepend" :text='idSelected' variant='primary')
							b-dropdown-item(v-for='(item, index) in ids' :key='index' @click='idSelect(item)' :class="getclass(item)") {{ item }}
						b-form-input#input-id(v-model='idValue' type='text' placeholder='' :state='idState' aria-describedby="input-id-feedback" trim)
						b-form-invalid-feedback#input-id-feedback 
							p(v-for='f in feedback') {{ f }}
				.col-md.mt-2( v-if='nameShow && !feedback.length')
					b-input-group(prepend='Nama')
						input.form-control(v-model='nama' type='text' placeholder='')
</template>


<script>
export default {
	components: {
		bInputGroup: () => import('~/node_modules/bootstrap-vue/es/components/input-group/input-group'),
		bFormSelect: () => import('~/node_modules/bootstrap-vue/es/components/form-select/form-select'),
		bFormInput: () => import('~/node_modules/bootstrap-vue/es/components/form-input/form-input'),
		bFormInvalidFeedback: () => import('~/node_modules/bootstrap-vue/es/components/form/form-invalid-feedback'),
		bDropdown: () => import('~/node_modules/bootstrap-vue/es/components/dropdown/dropdown'),
		bDropdownItem: () => import('~/node_modules/bootstrap-vue/es/components/dropdown/dropdown-item'),
	},
	data: () => ({
		feedback:[],
		nama:'',
		idValue: '',
		idSelected: 'No Rekam Medis',
		ids: ['No Rekam Medis', 'No JKN/KIS/BPJS', 'NIK'],
		alert: true,
		hariSelected: 'Besok',
		poliSelected: 'Umum',
		poli: ['Umum', 'KIA', 'MTBS', 'Imunisasi', 'Gigi', 'Lansia', 'THT'].sort()
	}),
	watch: {
		idValue(val){
			this.idValue = val.toUpperCase()
			this.feedback = []
			if(val.match(/^((1|4|9|X|x)(0|1|2|3|4|5|6|7|8|9))([0-9]){1,9}$/)) {
				this.idSelected = 'No Rekam Medis'
				this.feedback = []
				if(val.length < 6 ){
					this.feedback.push('Masukkan sekurangnya 6 digit No Rekam Medis.')
				}
				if(val.length > 9 ){
					this.feedback.push('Anda terlalu banyak memasukkan No Rekam Medis.')
				}
			} else {
				this.feedback.push('Bukan No Rekam Medis yang valid.')
				if(val.match(/^(0)([0-9]){1,12}$/)) {
					this.idSelected = 'No JKN/KIS/BPJS'
					this.feedback = []
					if(val.length < 12 ){
						this.feedback.push('Masukkan 12 digit No JKN/KIS/BPJS.')
					} else if( val.length > 12 ) {
						this.feedback.pop()
						this.feedback.push('No JKN/KIS/BPJS terlalu banyak (lebih dari 12 digit).')
					}
				} else {
					this.feedback.push(`Bukan No JKN/KIS/BPJS yang valid.`)
					if(val.match(/^(3)([0-9]){1,16}$/)) {
						this.idSelected = 'NIK'
						this.feedback = []
						if(val.length < 16 ){
							this.feedback.push('Masukkan 16 digit No NIK.')
						} else if( val.length > 16 ) {
							this.feedback.pop()
							this.feedback.push('No NIK terlalu banyak (lebih dari 16 digit).')
						}
					} else {
						this.feedback.push('Bukan No NIK yang valid.')

					}
					
				}
			} 

		},
		nama(val){
			this.nama = val.toUpperCase()
		}
	},
	computed: {
		hari(){
			let hari = ['Hari ini', 'Besok', 'Lusa']
			if(this.$moment().hour() >= 8) {
				hari.shift()
			}
			return hari
		},
		idState(){
			return this.idValue.length === 0 ? null : this.idValue.length < 6 ? false : this.feedback.length ? false : true
		},
		nameShow(){
			if(this.idSelected === 'No Rekam Medis' && this.idValue.length === 6) {
				return true
			}
			return false
		},
	},
	methods:{
		getclass(item){
			if(this.idSelected === item){
				return 'active'
			}
			return ''
		},
		hide() {
			this.alert=false
		},
		idSelect(item){
			this.idSelected = item
		}
	}
}
</script>

