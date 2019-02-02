<template lang="pug">
div
  b-table(stacked='md' responsive :items='items' :fields='fields')
    template(v-for="day in days" :slot='day' slot-scope='tgl')
      b-form-input(v-if='editing' :placeholder='JSON.stringify(tgl.item[tgl.field.key] || 0)' v-model='tgl.item[tgl.field.key]' @input='inputan(tgl.item)') 
      div(v-else) {{tgl.item[tgl.field.key]}}
</template>

<script src='./index.js'>
</script>