export const state = () => ({
	list: []
});

export const mutations = {
	add({ list }, indicator) {
		list.push(indicator);
	},
	emptyList({ list }) {
		list.length = 0;
	}
};

export const getters = {
	list: ({ list }) => list
};
