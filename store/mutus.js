import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl || 'http://localhost:1337'

const strapi = new Strapi(apiUrl)

export const state = () => ({
	list: []
});

export const mutations = {
	add({ list }, indicator) {
		list.push(indicator);
	},
	emptyList({ list }) {
		list.length = 0;
	},
	replace({ list }, indicator) {
		let ids = list.map( ind => ind.id)
		let id = ids.indexOf(indicator.id)
	//	console.log(JSON.stringify(list[id], null, 2))
		list[id].rekap = indicator.rekap
		list[id]._showDetails = true
	//	console.log(JSON.stringify(list[id], null, 2))
	}
};

export const getters = {
	list: ({ list }) => list
};

export const actions = {
	async fetch( store, { query, month }) {
		store.commit("emptyList");
		const { data: { states } } = await strapi.request("post", "/graphql", {
			data: {
				query,
				variables: {
					name: 'mutu',
					month: month || this.$moment().format('MMMM YYYY')
				}
			}
		});
	
		const { indicators } = states[0];
		for(let i=0; i< indicators.length; i++) {
			const indicator = indicators[i]
	
			let push = {}
	
			if (indicator.counternames.length) {
				for (let counter of indicator.counternames) {
					push[counter.countertype.name] = counter.name
				}
			}
	
			store.commit("add", Object.assign({
				id: indicator._id,
				bagian: indicator.bagian.nama,
				indikator: indicator.name,
			 }, push, {
				operator: indicator.operator.name,
				numtarget: indicator.target,
				satuan: indicator.satuan.name,
				target: `${indicator.operator.name === '<=' ? `<= ` : ``}${indicator.target} ${indicator.satuan.name === 'persen' ? '%' : indicator.satuan.name}`,
				rekap: indicator.rekaps[0]
			}));
		}
	
	}
}