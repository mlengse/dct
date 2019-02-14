import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl || 'http://localhost:1337'
//const apiUrl = 'http://192.168.1.77:1337'

const strapi = new Strapi(apiUrl)

const counterQuery = `
query State($id: ID!){
	counter(id: $id) {
		_id
		jumlah
		waktu
		countername {
			_id
		}
	}
}
				`

export const state = () => ({
	list:[],
	data:{},
	indicatorList: [],
	indicator: {},
	counternameList: [],
	countername: {},
	counterList: [],
	counter: {},
	rekapList: [],
	rekap: {}
});

export const mutations = {
	counterMutate( state, payload ){
		if(state.counterList.indexOf(payload._id) < 0){
			state.counterList.push(payload._id)
		}
		state.countername[payload.countername._id].counters.push(payload._id)
		state.counter = {
			...state.counter,
			[payload._id]: {
				jumlah: payload.jumlah,
				waktu: payload.waktu,
				countername: payload.countername._id
			}
		}
	},
	rekapMutate( state, payload ){
		//console.log(JSON.stringify(payload, null, 2))
		if(state.rekapList.indexOf(payload._id) < 0){
			state.rekapList.push(payload._id)
		}
		state.indicator[payload.indicator._id].rekaps.push(payload._id)
//		console.log(JSON.stringify(state.indicator[payload.indicator._id], null, 2))
		state.rekap = {
			...state.rekap,
			[payload._id]: {
				jumlah: payload.jumlah,
				periode: payload.periode,
				indicator: payload.indicator._id,
			}
		}
	},
	stateMutate(state, stateData) {
		if (state.list.indexOf(stateData.name) < 0){
			state.list.push(stateData.name)
		}
		state.data = {
			...state.data,
			[stateData.name]: {
				_id: stateData._id,
				name: stateData.name,
				indicators: stateData.indicators.map( indicator => indicator._id)
			}
		}
	},
	counternameMutate( state, countername ){
//		console.log(JSON.stringify(countername, null, 2))
		if(state.counternameList.indexOf(countername._id) < 0){
			state.counternameList.push(countername._id)
		}
		state.countername = {
			...state.countername,
			[countername._id]: {
				_id: countername._id,
				name: countername.name,
				type: countername.countertype.name,
				counters: countername.counters.map(counter => counter._id)
			}
		}
	},
	indicatorMutate(state, indicator) {
		if (state.indicatorList.indexOf(indicator._id) < 0) {
			state.indicatorList.push(indicator._id)
		}
		state.indicator = {
			...state.indicator,
			[indicator._id]: indicator
		}
	}

};

export const getters = {
	mutus: ({ indicator, data }) => data.mutu.indicators.map(indicatorId => indicator[indicatorId]),
	countername: ({ countername }) => id => countername[id],
	rekap: ({rekap}) => id => rekap[id],
	counter: ({counter}) => id => counter[id]
};

export const actions = {
	async counter( store, {vm, counterId}){
		vm.$nuxt.$loading.start()
		const { data: {counter} } = await strapi.request("post", "/graphql", {
			data: {
				query: counterQuery,
				variables: {
					id: counterId
				}
			}
		});
		vm.$nuxt.$loading.finish()
		store.commit('counterMutate', counter)
	},
	async sendCounter( store, { counter }){
		let exist = await strapi.getEntries('counters', { 
			waktu: counter.waktu,
			countername: {
				_id: counter.countername._id
			}
		})
		let res
		if(exist.length){
			let counterId = exist[0]._id
			res = await strapi.updateEntry('counters', counterId, counter)
		} else {
			res = await strapi.createEntry('counters', counter)
		}
		store.commit('counterMutate', res)
	},
	async sendRekap( store, { rekap }){
		let exist = await strapi.getEntries('rekaps', { 
			periode: rekap.periode,
			indicator: {
				_id: rekap.indicator._id
			}
		})
		let res
		if(exist.length){
			let rekapId = exist[0]._id
			res = await strapi.updateEntry('rekaps', rekapId, rekap)
		} else {
			res = await strapi.createEntry('rekaps', rekap)
		}
		store.commit('rekapMutate', res)
	},
	async fetchRekap( store, { query, periode}){
	//	console.log(periode)
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
					counternames: [],
					rekaps: [],
				}

				if (indicators[i].counternames.length) {
					for (let countername of indicators[i].counternames) {
						store.commit('counternameMutate', countername)
						indicator.counternames.push(countername._id)
					}
				}

				store.commit("indicatorMutate", indicator);
			}
		})
	}
}