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
	menu: {},
	auth: null,
	token: '',
	jwt: ''
})

export const mutations = {
	add({ menuList, menu}, payload) {
		payload.cover = payload.cover.url
		menuList.push(payload._id)
		menu[payload._id] = payload
	},
	setAuth(state, val) {
		state.auth = val.user
		state.jwt = val.jwt
		state.token = val.user._id
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

		let auth = await strapi.login(process.env.strapiUser, process.env.strapiPwd);

		commit('setAuth', auth)

		commit('emptyList')
		const { data: { menus } } = await strapi.request('post', '/graphql', {
			data: {
				query
			}
		})

		menus
		.sort()
		.filter( menu => ['Indikator Mutu', 'SPM', 'IKS', 'Posyandu Balita', 'Pandawa'].indexOf(menu.nama) >= 0)
		.forEach(menu => {
			commit('add', menu)
		})

	}
}