<template lang="pug">
  index-page
</template>

<script>
import IndexPage from "~/components/IndexPage/index.vue";
import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl || 'http://localhost:1337'

const strapi = new Strapi(apiUrl)

const query = `
query {
	menus {
		_id
		nama
		deskripsi
		url
		cover {
			url
		}
	}
}
`;

export default {
	layout: 'front',
	components: {
		'index-page': IndexPage
	},
	fetch: async ({ store }) => {
		store.commit('menus/emptyList')
		const { data: { menus } } = await strapi.request('post', '/graphql', {
			data: {
				query
			}
		})

		menus.forEach(menu => {
			store.commit('menus/add', {
				id: menu.id || menu._id,
				...menu
			})
		})
	}
}
</script>