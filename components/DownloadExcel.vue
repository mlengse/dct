<template lang="pug">
button.btn.btn-primary.btn-sm(type='button' @click='exportXLSX') {{label}}
</template>

<script>


export default {
  props: ['data', 'fields', 'name', 'label'],
  methods:{
    exportXLSX(){
      let vm = this
      var data = []
      import('xlsx').then(({ utils: {
        json_to_sheet,
        book_new,
        book_append_sheet
      }, writeFile }) => { 
        vm.data.map( e => {
          let obj = {}
          Object.keys(vm.fields).map( a =>{
            obj[a] = e[vm.fields[a]]
          })
          data.push(obj)
        })
      // console.log(JSON.stringify(data, null, 2))
        var WS = json_to_sheet(data);
        var wb = book_new()
        book_append_sheet(wb, WS, vm.name.split('.')[0])
        writeFile(wb, vm.name)

      })
    }
  }
}
</script>
