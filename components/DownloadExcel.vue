<template lang="pug">
button.btn.btn-primary.btn-sm(type='button' :disabled='loaded || false' @click='exportXLSX') {{label}}
</template>

<script>
export default {
  props: ['data', 'fields', 'name', 'label', 'loaded'],
  methods: {
    async exportXLSX() {
      if (process.browser) {
        const exceljs = () => await import('exceljs/dist/es5/exceljs.browser')
        const { Workbook } = exceljs;
        //console.log(JSON.stringify(this.fields, null, 2))
        var workbook = new Workbook(); //creating workbook
        var sheet = workbook.addWorksheet(this.name.split('.xlsx').join('')); //creating worksheet    
        sheet.addRow().values = Object.keys(this.fields)
        var vm = this
        this.data.forEach(function (item) {
          //console.log(JSON.stringify(item, null, 2))
          var valueArray = [];
          Object.keys(vm.fields).map(header => {
            valueArray.push(item[vm.fields[header]])
          }) // forming an array of values of single json in an array
          //console.log(valueArray)
          sheet.addRow().values = valueArray; // add the array as a row in sheet
        })
        let data = await workbook.xlsx.writeBuffer()
        //console.log(data)
        let blob = new Blob([data], { type: "application/octet-stream" });
        const fileSaver = () => await import('file-saver');
        const { saveAs } = fileSaver
        saveAs(blob, this.name);
      }
    }
  },
}

</script>
