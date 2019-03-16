<template lang="pug">
div
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
