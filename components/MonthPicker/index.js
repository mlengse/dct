export default {
	props: ['loading'],
	data: () => ({
		month: ''
	}),
	created() {
		this.month = this.$moment().subtract(1, 'month').format('MMMM YYYY')
	},
	watch: {
		month: function(newVal, oldVal) {
			if(newVal !== oldVal) {
				this.$emit('updateMonth', newVal)
			}
		}
	},
	methods: {
		goBlnJalan() {
			this.month = this.$moment().format('MMMM YYYY')
		},
		goBlnHitung() {
			this.month = this.$moment().subtract(1, 'month').format('MMMM YYYY')
		},
		prevMonth() {
			this.month = this.$moment(this.month, 'MMMM YYYY').subtract(1, 'month').format('MMMM YYYY')
		},
		nextMonth() {
			this.month = this.$moment(this.month, 'MMMM YYYY').add(1, 'month').format('MMMM YYYY')
		}
	},
	computed: {
		blnJalan() {
			return this.month !== this.$moment().format('MMMM YYYY')
		},
		blnHitung() {
			return this.month !== this.$moment().subtract(1, 'month').format('MMMM YYYY')
		},
	}
}