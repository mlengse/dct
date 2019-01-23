<template lang="pug">
  section.container 
    .row
      .col-md-12
        .form-group.mt-3
          input.form-control(v-model='query' type='text' placeholder='Search...')
    .row
      .col-md-12
        ul.card-columns.list-unstyled
          li.card(v-for='menu in filteredList' :key='menu.id')
            img.card-img-top(v-if='menu.cover' :src='menu.cover.url')
            .card-body
              h5.card-title {{ menu.nama }}
              p.card-text {{ menu.deskripsi || '' }}
              a.btn.btn-primary(v-if='menu.url' :href="menu.url") Lihat menu
              nuxt-link.btn.btn-primary(v-else :to=`menu.nama.toLowerCase().split(' ').join('-')` tag='a') Lihat menu
          p(v-if='!filteredList.length') No results :(
</template>

<script src='./index.js'>
</script>
