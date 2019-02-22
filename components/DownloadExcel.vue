<template lang="pug">
button.btn.btn-primary.btn-sm(type='button' :disable='loaded || false' @click='exportXLSX') {{label}}
</template>

<script>


export default {
  props: ['data', 'fields', 'name', 'label', 'loaded'],
  data: () => ({
    xlsx: null,
    wb: null,
    ws: null
  }),
  async mounted(){
    const xlsx = await import('xlsx')
    this.xlsx = xlsx
  },
  methods:{
    exportXLSX(){
      if(!this.wb){
        this.wb = this.xlsx.utils.book_new()
      }
      if(!this.ws){
        this.ws = this.xlsx.utils.json_to_sheet(this.items);
      }
      this.xlsx.utils.book_append_sheet(this.wb, this.ws, this.name.split('.')[0])
      this.xlsx.writeFile(this.wb, this.name)
      this.ws = null
      this.wb = null
    }
  },
  computed: {
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
  }
}
</script>
