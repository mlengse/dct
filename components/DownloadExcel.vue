<template lang="pug">
b-button(size='sm' variant="primary" @click='exportXLSX') {{label}}
</template>

<script>
import XLSX from 'xlsx'
export default {
  props: ['data', 'fields', 'name', 'label'],
  methods:{
    exportXLSX(){
      var data = []
      this.data.map( e => {
        let obj = {}
        Object.keys(this.fields).map( a =>{
        	obj[a] = e[this.fields[a]]
        })
        data.push(obj)
      })
     // console.log(JSON.stringify(data, null, 2))
      var WS = XLSX.utils.json_to_sheet(data);
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, WS, this.name.split('.')[0])
      XLSX.writeFile(wb, this.name)
    }
  }
}
</script>
