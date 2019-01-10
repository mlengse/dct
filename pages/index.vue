<template lang="pug">
  section.container
    .row
      .col-md-12
        .form-group.mt-3
          input.form-control(v-model='query' type='text' placeholder='Search...')
    .row
      .col-md-12
        ul.card-columns.list-unstyled
          li.card(v-for='restaurant in filteredList' :key='restaurant.id')
            img.card-img-top(v-if='restaurant.image' :src='restaurant.image.url')
            .card-body
              h5.card-title {{ restaurant.name }}
              p.card-text {{ restaurant.description || 'No description' }}
              router-link.btn.btn-primary(:to="{ name: 'restaurants-id' , params: { id: restaurant.id }}" tag='a') See dishes
          p(v-if='!filteredList.length') No results :(
</template>

<script src='./index.js'>
</script>
