import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl || 'http://localhost:1337'

const strapi = new Strapi(apiUrl)

export const state = () => ({
	list:[],
	data:{},
	indicatorList: [],
	indicator: {},
	counterList: [],
	counter: {},
	rekapList: [],
	rekap: {}
});

export const mutations = {
	rekapMutate( state, payload ){
		if(state.rekapList.indexOf(payload._id) < 0){
			state.rekapList.push(payload._id)
			state.indicator[payload.indicator._id].rekaps.push(payload._id)
		}
		state.rekap[payload._id] = {
			jumlah: payload.jumlah,
			periode: payload.periode,
			indicator: payload.indicator._id,
		}
	},
	stateMutate(state, stateData) {
		if (state.list.indexOf(stateData.name) < 0){
			state.list.push(stateData.name)
		}
		state.data[stateData.name] = {
			_id: stateData._id,
			name: stateData.name,
			indicators: stateData.indicators.map( indicator => indicator._id)
		}
	},
	counterMutate( state, counter ){
		if(state.counterList.indexOf(counter._id) < 0){
			state.counterList.push(counter._id)
		}
		state.counter[counter._id] = {
			name: counter.name,
			type: counter.countertype.name
		}
	},
	indicatorMutate(state, indicator) {
		if (state.indicatorList.indexOf(indicator._id) < 0) {
			state.indicatorList.push(indicator._id)
		}
		state.indicator[indicator._id] = indicator
	}

};

export const getters = {
	mutus: ({indicator, data}) => data.mutu && data.mutu.indicators.map(indicatorId => indicator[indicatorId]),
	counters: ({ counter }) => id => counter[id],
	rekap: ({rekap}) => id => rekap[id],
};

export const actions = {
	async fetchRekap( store, { query, periode}){
		const { data: { rekaps} } = await strapi.request("post", "/graphql", {
			data: {
				query,
				variables: {
					periode
				}
			}
		});

		if(rekaps.length){
			rekaps.map( rekap => {
				store.commit('rekapMutate', rekap)
			})
		}

	},
	async fetch( store, { query, name }) {
		const { data: { states } } = await strapi.request("post", "/graphql", {
			data: {
				query,
				variables: {
					name
				}
			}
		});

		states.map( stateData => {
			store.commit('stateMutate', stateData)
			const { indicators } = stateData;
			for (let i = 0; i < indicators.length; i++) {
				let indicator = {
					_id: indicators[i]._id,
					bagian: indicators[i].bagian.nama,
					indikator: indicators[i].name,
					operator: indicators[i].operator.name,
					numtarget: indicators[i].target,
					satuan: indicators[i].satuan.name,
					target: `${indicators[i].operator.name === '<=' ? `<= ` : ``}${indicators[i].target} ${indicators[i].satuan.name === 'persen' ? '%' : indicators[i].satuan.name}`,
					counters: [],
					rekaps: [],
				}

				if (indicators[i].counternames.length) {
					for (let counter of indicators[i].counternames) {
						store.commit('counterMutate', counter)
						indicator.counters.push(counter._id)
					}
				}

				store.commit("indicatorMutate", indicator);
			}
		})
	}
}