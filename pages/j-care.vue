<template lang='pug'>
#content
	form#login(action="/j-care/" method="post" accept-charset="utf-8")
		div(style="display:none;")
			input(type="hidden" name="_method" value="POST")
		label(for="UserUsername") Username
		input#UserUsername(name="data[User][username]" type="text" maxlength="255")
		label(for="UserPassword") Password
		input#UserPassword(type="password" name="data[User][password]")
		.submit
			input(type="submit" value="LOGIN")
	form#guestFormLogin(action="/j-care/" method="post" accept-charset="utf-8")
		div(style="display:none;")
			input(type="hidden" name="_method" value="POST")
		input(type="hidden" name="data[User][username]" value="anonym")
		input(type="hidden" name="data[User][password]" value="anonym")
		.submit
			input(type="submit" value="Masuk sebagai pengunjung")
</template>

<script>
export default {
	layout: 'simpus',
}
</script>
<style>
@-webkit-keyframes chartjs-render-animation{from{opacity:0.99}to{opacity:1}}@keyframes chartjs-render-animation{from{opacity:0.99}to{opacity:1}}.chartjs-render-monitor{-webkit-animation:chartjs-render-animation 0.001s;animation:chartjs-render-animation 0.001s;}
</style>
