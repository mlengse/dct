<template lang="pug">
span.tag(:class='["is", variant].join("-")') {{status}}

</template>

<script>
export default {
	props: ['status', 'variant'],
}
</script>

<style lang="sass" scoped>
@import "~/node_modules/bulma/sass/utilities/_all.sass"
@import "~/node_modules/bulma/sass/elements/tag.sass"
</style>
