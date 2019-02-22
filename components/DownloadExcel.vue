<template lang="pug">
button.btn.btn-primary.btn-sm(type='button' @click='exportXLSX') {{label}}
</template>

<script>


export default {
  props: ['data', 'fields', 'name', 'label'],
  methods:{
    exportXLSX(){
      var data = []
      const { json_to_sheet, book_new, book_append_sheet, writeFile }  = () => import('xlsx').then(({ utils: {
        json_to_sheet,
        book_new,
        book_append_sheet
      }, writeFile }) => ({ json_to_sheet, book_new, book_append_sheet, writeFile }))
      this.data.map( e => {
        let obj = {}
        Object.keys(this.fields).map( a =>{
        	obj[a] = e[this.fields[a]]
        })
        data.push(obj)
      })
     // console.log(JSON.stringify(data, null, 2))
      var WS = json_to_sheet(data);
      var wb = book_new()
      book_append_sheet(wb, WS, this.name.split('.')[0])
      writeFile(wb, this.name)
    }
  }
}
</script>
