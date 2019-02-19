<template lang="pug">
section.container 
	.row.mt-2
		h3 Detail Indikator SPM 

</template>

<script>
export default {
  data: () => ({
    id: '',
    tahun: ''
  }),
  mounted(){
    this.id = this.$route.query.id
    this.tahun = this.$route.query.tahun
    
  }
}
</script>

