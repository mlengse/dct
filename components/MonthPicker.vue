<template lang="pug">
b-button-toolbar(key-nav  aria-label="Toolbar with button groups")
	b-button-group.mx-1
		b-btn(:disabled='prev' variant='primary' @click='prevMonth') &lsaquo;
		b-btn(disabled variant='outline-primary' ) {{month}}
		b-btn(v-if='!sameOrAfter' :disabled='next' variant='primary' @click='nextMonth') &rsaquo;
	b-button-group.mx-1
		b-btn(v-if='blnHitung' :disabled='loading' variant='primary' @click='goBlnHitung') bulan hitung
		b-btn(v-if='blnJalan' :disabled='loading' variant='primary' @click='goBlnJalan') bulan berjalan

</template>

<script>
export default {
	props: ['loading'],
	data: () => ({
		month: ''
	}),
	created() {
		this.month = this.$moment().subtract(1, 'month').format('MMMM YYYY')
	},
	watch: {
		month: function(newVal) {
			this.$emit('updateMonth', newVal)
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
		prev() {
			return this.loading
		},
		sameOrAfter(){
			return this.$moment(this.month, 'MMMM YYYY').isSameOrAfter(this.$moment()) 
		},
		next() {
			return this.loading || this.sameOrAfter
		},
		blnJalan() {
			return this.month !== this.$moment().format('MMMM YYYY')
		},
		blnHitung() {
			return this.month !== this.$moment().subtract(1, 'month').format('MMMM YYYY')
		},
	}
}
</script>

