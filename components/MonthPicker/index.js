export default {
    props: ['loading'],
    data: () => ({
        month: ''
    }),
    created() {
        this.month = this.$moment().format('MMMM YYYY')
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
            this.month = this.$moment(this.month, 'MMMM YYYY').add(-1, 'month').format('MMMM YYYY')
        },
        nextMonth() {
            this.month = this.$moment(this.month, 'MMMM YYYY').add(1, 'month').format('MMMM YYYY')
        }
    },
}