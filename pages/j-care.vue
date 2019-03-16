<template lang='pug'>
div
	login
	simpus-login
</template>

<script>
import Login from '~/components/Login.vue'

import simpusLogin from '@/components/SimpusLogin.vue'
export default {
	layout: 'simpus',
	components: {
		simpusLogin,
		Login
	}
}
</script>
<style>
@-webkit-keyframes chartjs-render-animation{from{opacity:0.99}to{opacity:1}}@keyframes chartjs-render-animation{from{opacity:0.99}to{opacity:1}}.chartjs-render-monitor{-webkit-animation:chartjs-render-animation 0.001s;animation:chartjs-render-animation 0.001s;}
</style>
