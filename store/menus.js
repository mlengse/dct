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