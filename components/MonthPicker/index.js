import moment from 'dayjs'
moment.locale('id')

export default {
	props: ['loading'],
	data: () => ({
		month: ''
	}),
	created() {
		this.month = moment().format('MMMM YYYY')
	},
	watch: {
		month: function(newVal, oldVal) {
			if(newVal !== oldVal) {
				this.$emit('updateMonth', newVal)
			}
		}
	},
	methods: {
		prevMonth() {
			this.month = moment(this.month, 'MMMM YYYY').add(-1, 'month').format('MMMM YYYY')
		},
		nextMonth() {
			this.month = moment(this.month, 'MMMM YYYY').add(1, 'month').format('MMMM YYYY')
		}
	},
}