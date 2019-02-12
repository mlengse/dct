<template lang="pug">
b-button-toolbar(key-nav  aria-label="Toolbar with button groups")
	b-button-group.mx-1
		b-btn(size='sm' :disabled='loading' variant='primary' @click='prevMonth') &lsaquo;
		b-btn(size='sm' disabled variant='outline-primary' ) {{month}}
		b-btn(size='sm' :disabled='loading' variant='primary' @click='nextMonth') &rsaquo;
	b-button-group.mx-1
		b-btn(size='sm' v-if='blnHitung' :disabled='loading' variant='primary' @click='goBlnHitung') bulan hitung
		b-btn(size='sm' v-if='blnJalan' :disabled='loading' variant='primary' @click='goBlnJalan') bulan berjalan

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
</script>

