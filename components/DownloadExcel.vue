<template lang="pug">
button.btn.btn-primary.btn-sm(type='button' @click='exportXLSX') {{label}}
</template>

<script>


export default {
  props: ['data', 'fields', 'name', 'label'],
  data: () => ({
    xlsx: null,
  }),
  async mounted(){
    const xlsx = await import('xlsx')
    this.xlsx = xlsx
  },
  methods:{
    exportXLSX(){
      this.xlsx.utils.book_append_sheet(this.wb, this.ws, this.name.split('.')[0])
      this.xlsx.writeFile(this.wb, this.name)
    }
  },
  computed: {
    wb(){
      return this.xlsx.utils.book_new()
    },
    items(){
      var data = []
      this.data.map( e => {
        let obj = {}
        Object.keys(this.fields).map( a =>{
          obj[a] = e[this.fields[a]]
        })
        data.push(obj)
      })
      return data
    },
    ws(){
      return this.xlsx.utils.json_to_sheet(this.items);
    }
  }
}
</script>
