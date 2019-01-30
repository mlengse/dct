export default {
	props: ['row', 'month'],
	data: () => ({
		editing: false,
		pembilang: '0',
		penyebut: '0',
		rincian: false,
	}),
	methods: {
		toggleButton() {
			this.editing = !this.editing
		},
		simpan() {
			this.editing = !this.editing

		},
		rinci() {
			this.rincian = !this.rincian
		}
	},
	computed: {
		rekap() {
			return (this.pembilang / this.penyebut && this.pembilang / this.penyebut !== Infinity) ? `${this.pembilang / this.penyebut * 100} %` : 
			(this.row.item.rekap ? `${(this.row.item.rekap.jumlah)} %` : '0 %')
		},
		days() {
			let startOfMonth = this.$moment(this.month, 'MMMM YYYY').startOf("month");
			let endOfMonth = this.$moment(this.month, 'MMMM YYYY').endOf("month");
			let day = startOfMonth;
			let days = []
			while (day <= endOfMonth) {
				days.push(day.format('D'))
				day = day.clone().add(1, "d");
			}
			return days
		},
		fields() {
			return ['hari', ...this.days]
		},
		hariObj(){
			let ho = {}
			this.days.map( day => ho[day] = 0)
			return ho
		},
		items() {
			return [
				Object.assign({
					'hari': 'pembilang'
				}, this.hariObj),
				Object.assign({
					'hari': 'penyebut'
				}, this.hariObj)
			]
		}
	}
}