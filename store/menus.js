export const state = () => ({
	list: []
})

export const mutations = {
	add({ list }, menu) {
		list[list.length] = menu
	},
	emptyList({ list }) {
		list.length = 0
	}
}

export const getters = {
	list: ({ list }) => list
}