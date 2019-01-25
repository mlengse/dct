<template lang="pug">
  b-container(fluid) 
    .row
      .col-md-12
        h3 Indikator Mutu
    .row
      .col-md-12
        MonthPicker(@updateMonth='updateMonth' :loading='loaded')
    .row
      .col-md-12
        .form-group.mt-3
          input.form-control(v-model='query' type='text' placeholder='Search...')
    .row
      .col-md-12
        b-table(striped hover responsive :busy.sync='loaded' :per-page="perPage" :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :fields="fields" :items="filteredMutu" )
          template(slot='capaian' slot-scope='data') 
            b-alert(:variant='data.item.varian' show) {{data.item.capaian}}                
          template(slot="action" slot-scope="data")
            b-button-group.mx-1
              b-btn(v-b-modal='data.item.id' :key='data.item.id+"-modal-button"' variant='outline-primary' size='sm') Detail
              b-btn(v-if='data.item.capaian === "Belum diinput"' variant='warning' size='sm') Input
              b-btn(v-if='data.item.capaian === "Belum tercapai"' variant='danger' size='sm') Evaluasi
            b-modal(:id='data.item.id' :key='data.item.id+"-modal"')
              b-card
                pre {{ data.item }}
    .row
      .col-md-12
        b-pagination(:total-rows="totalRows" :per-page="perPage" v-model="currentPage")
</template>

<script src='./index.js'>
</script>
