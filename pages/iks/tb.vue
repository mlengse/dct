<template lang="pug">
section.container 
	.row.mt-2
		h3 Penderita TB Paru (PIS-PK)
	.row.mt-2.fluid
		b-table(responsive :busy.sync='loaded' stacked='sm' striped hover :fields='fields' :items="items")
</template>
<script>
import BTable from '~/node_modules/bootstrap-vue/es/components/table/table'
export default {
	middleware: 'anonymous',
	components: {
		BTable
	},
	async beforeMount() {
		await this.$nextTick( async () => {
			this.$nuxt.$loading.start()
			this.loaded = true
			await this.$store.dispatch('iks/tb')
			this.loaded = false
			this.$nuxt.$loading.finish()
		})

	},
	data: () => ({
		loaded: false,
		fields: {}
	}),
	computed: {
		items(){
			return []
		}
	}
}
</script>

