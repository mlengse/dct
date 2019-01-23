<template lang="pug">
  section.container 
    .row
      .col-md-12
        h3 Indikator Mutu

    .row
      .col-md-12
        .form-group.mt-3
          input.form-control(v-model='query' type='text' placeholder='Search...')

    .row
      b-table(striped hover responsive :per-page="perPage" :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :fields="fields" :items="filteredMutu" @row-hovered="rowHover")
        template(slot="action" slot-scope="data")
          b-btn(v-b-modal='data.item.id') detail
          b-modal(:id='data.item.id')
            b-list-group
              b-list-group-item(v-for='(value, key) in data.item' :key='data.item.id+key') {{key}}: {{value}}
    .row
      b-pagination(:total-rows="totalRows" :per-page="perPage" v-model="currentPage")
</template>

<script src='./index.js'>
</script>
