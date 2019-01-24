import moment from 'moment'
import 'moment/locale/id.js'
moment.locale('id')
export default {
    data: () => ({
        month: ''
    }),
    created() {
        this.month = moment().format('MMMM YYYY')
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