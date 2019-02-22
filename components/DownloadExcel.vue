<template lang="pug">
button.btn.btn-primary.btn-sm(type='button' @click='exportXLSX') {{label}}
</template>

<script>
import { utils, writeFile } from 'xlsx'

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
      var WS = utils.json_to_sheet(data);
      var wb = utils.book_new()
      utils.book_append_sheet(wb, WS, this.name.split('.')[0])
      writeFile(wb, this.name)
    }
  }
}
</script>
