<template lang="pug">
section.container 
	.row.mt-2
		h3 {{ $route.query.id }}
	.row.mt-2.fluid
		b-table(responsive :busy.sync='loaded' stacked='sm' striped hover :fields='fields' :items="items")

</template>
<script>
export default {
  components: {
		BTable: () => import('~/node_modules/bootstrap-vue/es/components/table/table'),
  },
  //middleware: 'anonymous',
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

