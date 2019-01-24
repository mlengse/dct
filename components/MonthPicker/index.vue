<template lang="pug">
    b-button-toolbar(key-nav  aria-label="Toolbar with button groups")
        b-button-group.mx-1
            b-btn(variant='primary' size='lg' @click='prevMonth') &lsaquo;
            b-btn(variant='outline-primary' size='lg') {{month}}
            b-btn(variant='primary' size='lg' @click='nextMonth') &rsaquo;    
</template>

<script src='./index.js'>
</script>

