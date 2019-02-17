import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl || 'http://localhost:1337'

const strapi = new Strapi(apiUrl)

import fetchQuery from '../schema/fetchmutu.graphql'
import createdQuery from '../schema/createdmutu.graphql'

export const state = () => ({
	indicatorList: [],
	indicator: {},
	pembilang: {},
	penyebut: {},
	counter: {},
	rekap: {},
	bln: {},
	tgl: {},

});

export const getters = {
	mutus: ({ indicatorList, indicator, pembilang, penyebut, counter, rekap }) => indicatorList.map(indicatorId => Object.assign({}, indicator[indicatorId], {
		rekaps: indicator[indicatorId].rekaps.map( rekapId => rekap[rekapId]),
		pembilang: Object.assign({}, pembilang[indicator[indicatorId].pembilang], {
			counters: pembilang[indicator[indicatorId].pembilang].counters.length ? pembilang[indicator[indicatorId].pembilang].counters.map(id => counter[id]) : [],
		}),
		penyebut: Object.assign({}, penyebut[indicator[indicatorId].penyebut], {
			counters: penyebut[indicator[indicatorId].penyebut].counters.length ? penyebut[indicator[indicatorId].penyebut].counters.map(id => counter[id]) : [],
		}),
	})),
	gettgl: ({ tgl }) => ({ name, tanggal }) => tgl[`${name} ${tanggal}`],
	getbln: ({ bln }) => ({ name, bulan }) => bln[`${name} ${bulan}`],
	rekap: ({rekap}) => id => rekap[id],
};



export const mutations = {
	rekapMutate( state, payload ){
		if(state.indicator[payload.indicator._id].rekaps.indexOf(payload._id) < 0) {
			state.indicator[payload.indicator._id].rekaps.push(payload._id)
		}
		state.rekap = Object.assign({}, state.rekap, {
			[payload._id]: {
				jumlah: payload.jumlah,
				periode: payload.periode,
				indicator: payload.indicator._id,
			}
		})
	},
	stateMutate(state, stateData) {
		if (state.list.indexOf(stateData.name) < 0){
			state.list.push(stateData.name)
		}
		state.data = Object.assign({}, state.data, {
			[stateData.name]: {
				_id: stateData._id,
				name: stateData.name,
				indicators: stateData.indicators.map( indicator => indicator._id)
			}
		})
	},
	counternameMutate( state, countername ){
		state[countername.countertype.name][countername._id] = Object.assign({}, countername, {
			type: countername.countertype.name,
			countertype: undefined,
			counters: []
		})
	},
	counterMutate( state, counter){
		state.counter[counter._id] = Object.assign({}, state.counter[counter._id], counter, {
			tgl: this.$moment(counter.waktu, this.$moment.ISO_8601).format('DD-MM-YYYY'),
			bln: this.$moment(counter.waktu, this.$moment.ISO_8601).format('MMMM YYYY'),
			isMonth: !!!Number(this.$moment(counter.waktu, this.$moment.ISO_8601).format('HHmmssss'))
		})
		
		if (state.counter[counter._id].isMonth) {
			state.bln[`${state.counter[counter._id].name} ${state.counter[counter._id].bln}`] = state.counter[counter._id]
		} else {
			console.log(JSON.stringify(state.counter[counter._id], null, 2))
			state.tgl[`${state.counter[counter._id].name} ${state.counter[counter._id].tgl}`] = state.counter[counter._id]
		}
	},
	counternameCountersMutate( state, countername){
		state[countername.countertype.name][countername._id] = Object.assign({}, state[countername.countertype.name][countername._id],{
			counters: countername.counters.map( counter =>{
				state.counter[counter._id] = Object.assign({}, state.counter[counter._id], counter, {
					name: state[countername.countertype.name][countername._id].name,
					type: countername.countertype.name,
					tgl: this.$moment(counter.waktu, this.$moment.ISO_8601).format('DD-MM-YYYY'),
					bln: this.$moment(counter.waktu, this.$moment.ISO_8601).format('MMMM YYYY'),
					isMonth: !!!Number(this.$moment(counter.waktu, this.$moment.ISO_8601).format('HHmmssss'))
				})
				
				if (state.counter[counter._id].isMonth) {
					state.bln[`${state.counter[counter._id].name} ${state.counter[counter._id].bln}`] = state.counter[counter._id]
				} else {
					state.tgl[`${state.counter[counter._id].name} ${state.counter[counter._id].tgl}`] = state.counter[counter._id]
				}
				return counter._id
			})
		})
	},
	counternameRekapsMutate(state, indicator) {
		state.indicator[indicator._id].rekaps = indicator.rekaps.map( rekap => {
			state.rekap[rekap._id] = rekap
			return rekap._id
		})
	},
	indicatorMutate(state, indicator) {
		if (state.indicatorList.indexOf(indicator._id) < 0) {
			state.indicatorList.push(indicator._id)
		}
		state.indicator[indicator._id] = indicator
	}

};

export const actions = {
	async sendCounter(store, counter) {
		let exist = counter._id
		let getEntries = false
		let sameJml = false
		let res = false

		if( exist ){
			getEntries = store.state.counter[counter._id] ? true : false
			if(getEntries) {
				sameJml = store.state.counter[counter._id].jumlah == counter.jumlah ? true : false
			} else {
				let length = (await strapi.getEntries('counters', {
					waktu: counter.waktu,
					countername: {
						_id: counter.countername
					}
				})).length
				
				if (length) {
					sameJml = counter.jumlah == exist[0].jumlah ? true : false
					counter._id = exist[0]._id
				} 
			}
		}

		if ( !sameJml ) {
			if(counter._id){
				res = await strapi.updateEntry('counters', counter._id, counter)
			} else {
				res = await strapi.createEntry('counters', counter)
			}
		} 
		if( res ) {
			console.log(JSON.stringify(res, null, 2))
			store.commit('counterMutate', res)
		}
		return
	},
	async sendRekap(store, rekap) {
		let exist = rekap._id
		let getEntries = false
		let sameJml = false
		let res = false

		if( exist ){
			getEntries = store.state.rekap[rekap._id] ? true : false
			if(getEntries) {
				sameJml = store.state.rekap[rekap._id].jumlah == rekap.jumlah ? true : false
			} else {
				let length = (await strapi.getEntries('rekaps', {
					waktu: rekap.waktu,
					indicator: {
						_id: rekap.indicator
					}
				})).length
				
				if (length) {
					sameJml = rekap.jumlah == exist[0].jumlah ? true : false
					rekap._id = exist[0]._id
				} 
			}
		}
		
		if ( !sameJml ) {
			if(rekap._id){
				res = await strapi.updateEntry('rekaps', rekap._id, rekap)
			} else {
				res = await strapi.createEntry('rekaps', rekap)
			}
		} 
		if( res ) {
			console.log(JSON.stringify(res, null, 2))
			store.commit('rekapMutate', res)
		}
		return
	},
	async createdMutu( store ){
		const { data: { states } } = await strapi.request("post", "/graphql", {
			data: {
				query: createdQuery,
				variables: {
					name: 'mutu'
				}
			}
		});
		states.map(stateData => {
			const { indicators } = stateData;
			for (let i = 0; i < indicators.length; i++) {
				if (indicators[i].rekaps.length) {
					store.commit("counternameRekapsMutate", indicators[i]);
				}
				if (indicators[i].counternames.length) {
					for (let countername of indicators[i].counternames) {
						if(countername.counters.length) {
							store.commit("counternameCountersMutate", countername);
						}
					}
				}
			}
		})

	},

	async fetch( store) {
		const { data: { states } } = await strapi.request("post", "/graphql", {
			data: {
				query: fetchQuery,
				variables: {
					name: 'mutu'
				}
			}
		});
		states.map( stateData => {
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
					rekaps:[]
				}
				if (indicators[i].counternames.length) {
					for (let countername of indicators[i].counternames) {
						indicator[countername.countertype.name] = countername._id
						store.commit("counternameMutate", countername);
					}
				}
				store.commit("indicatorMutate", indicator);
			}
		})
	}
}