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
				p
					button.btn.btn-outline-primary(type='button' @click='petunjuk = !petunjuk') {{ petunjuk ? 'Tutup' : 'Petunjuk'}}
				button.close(type="button" data-dismiss="alert" aria-label="Close" @click="hide")
					span(aria-hidden="true") &times;
	.card.mt-2(v-if='petunjuk')
		.card-body
			p Ketik: #daftar#hari#poli#no rekam medis#nama
			p Hari: sekarang, hariini, besok atau lusa
			p Poli: umum, kia, gigi, mtbs, lansia
			p Contoh: #daftar#besok#umum#909090#heru
			p Alternatif parameter selain #no rkm medis#nama:
			p #no rekam medis 8 digit
			p #no bpjs/kis (bila pasien bpjs/kis)
			p #no nik/ktp (bila sudah terdaftar di database kami)
			p Kirim via pesan WA ke +62 271 854 252
			p Tunggu balasan otomatis
			p Datang hari H dan konfirmasi ke informasi utk mendapatkan no antrian poli
			p Maturnuwun.
			p (sistem ini hanya untuk pasien lama)
	.card
		.card-body
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
			.row
				.col-md.mt-2
					b-input-group(prepend='Hari')
						b-form-select(v-model='hariSelected' :options='hari')
				.col-md.mt-2
					b-input-group(prepend='Poli tujuan')
						b-form-select(v-model='poliSelected' :options='poli')
			.row.justify-content-center(v-if='idValue.length && !feedback.length')
				.col-sm-3.mt-2
					button.col.btn.btn-primary(type='button' @click='kirim') Kirim
</template>


<script>
import getPasienGql from '~/apollo/queries/getPasien.gql'
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
		petunjuk: false,
		pasiens: [],
		feedback:[],
		nama:'',
		idValue: '',
		idSelected: 'No Rekam Medis',
		ids: ['No Rekam Medis', 'No JKN/KIS/BPJS', 'NIK'],
		alert: true,
		hariSelected: 'Besok',
		poliSelected: 'Umum',
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
		checkDevice() {
			let check = false;
			(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
			return check;
		},
		text(){
			return `%23daftar%23${this.hariSelected}%23${this.poliSelected}%23${this.idValue}${this.nama.length ? `%23${this.nama}` : ''}`
		},
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
		poli() {
			let poli = ['Umum', 'KIA (Ibu)', 'MTBS (Balita)', 'Gigi', 'Lansia (> 60 th)']
			let tglDaft = this.$moment()
			if(this.hariSelected === 'Besok') {
				tglDaft.add(1, 'd')
			}
			if(this.hariSelected === 'Lusa') {
				tglDaft.add(1, 'd')
			}
			if(tglDaft.day() === 1 || tglDaft.day() === 4) {
				poli.push('Imunisasi')
			}
			if(tglDaft.day() === 2){
				poli.push('THT')
			}
			return poli.sort()
		}
	},
	methods:{
		async kirim(){
			if(this.checkDevice){
				window.location.replace(`https://wa.me/62271854252/?text=${this.text}`)
			} else {
				window.location.replace(`https://web.whatsapp.com/send?phone=62271854252&text=${this.text}`)
			}
		},
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



