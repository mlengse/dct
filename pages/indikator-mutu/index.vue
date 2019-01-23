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
      .col-md-12
        b-table(striped hover :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :fields="fields" :items="filteredMutu" @row-hovered="rowHover")
</template>

<script src='./index.js'>
</script>
