<template lang="pug">
b-card(noBody)
  b-tabs(card v-model='weekSelected')
    b-tab(v-for='(week, id) in weeks' :title='`Minggu ke-${week}`' :key='`mg-${id}`')
      b-table(stacked='md' bordered outlined small hover fixed responsive :items='items' :fields='fields')
        template( slot='pembilang' slot-scope='tgl')
          b-form-input.text-right(v-if='editing && tgl.item.isActive' :placeholder='JSON.stringify(tgl.item[tgl.field.key] || 0)' v-model='tgl.item[tgl.field.key]' @input='inputan(tgl.item)') 
          div(v-else) {{tgl.item[tgl.field.key]}}
        template( slot='penyebut' slot-scope='tgl')
          b-form-input.text-right(v-if='editing && tgl.item.isActive' :placeholder='JSON.stringify(tgl.item[tgl.field.key] || 0)' v-model='tgl.item[tgl.field.key]' @input='inputan(tgl.item)') 
          div(v-else) {{tgl.item[tgl.field.key]}}
</template>

<script src='./index.js'>
</script>