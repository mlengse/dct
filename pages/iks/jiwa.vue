<template lang="pug">
section.container 
	.row.mt-2
		h3 Penderita Gangguan Jiwa (PIS-PK)
	.row.mt-2.fluid
		b-table(responsive :busy.sync='loaded' stacked='sm' striped hover :fields='fields' :items="items")

</template>
<script>
export default {
  middleware: 'anonymous',
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

