import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl

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



export const state = () => ({
	menuList: [],
	menu: {}
})

export const mutations = {
	add({ menuList, menu}, payload) {
		payload.cover = payload.cover.url
		menuList.push(payload._id)
		menu[payload._id] = payload
	},
	emptyList(state) {
		state.menuList = []
	}
}

export const getters = {
	list: ({ menuList, menu }) => menuList.map( menuId => menu[menuId])
}

export const actions = {
	async nuxtServerInit ({ commit }) {
		commit('emptyList')
		const { data: { menus } } = await strapi.request('post', '/graphql', {
			data: {
				query
			}
		})

		menus.forEach(menu => {
			commit('add', menu)
		})

	}
}