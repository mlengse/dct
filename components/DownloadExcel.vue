<template lang="pug">
button.btn.btn-primary.btn-sm(type='button' @click='exportXLSX') {{label}}
</template>

<script>


export default {
  props: ['data', 'fields', 'name', 'label'],
  data: () => ({
    xlsx: null
  }),
  methods:{
    runProcedure(xlsx){
      const { utils: {
        json_to_sheet,
        book_new,
        book_append_sheet
      }, writeFile } = xlsx

      var data = []
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
      return writeFile(wb, this.name)
    },
    exportXLSX(){
      if(!this.xlsx){
        var vm = this
        return import('xlsx').then( function(xlsx){
          vm.xlsx=xlsx
          return vm.runProcedure(xlsx)
        })
      }else {
        return this.runProcedure(this.xlsx)
      }
    }
  }
}
</script>
