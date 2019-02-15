import Strapi from 'strapi-sdk-javascript'
import query from '../schema/counter.graphql'
const apiUrl = process.env.apiUrl || 'http://localhost:1337'

const strapi = new Strapi(apiUrl)


export const state = () => ({
  counterList: [],
  counter: {},
  bln: {},
  tgl: {},
});

export const mutations = {
  save(state, payload) {
    payload.map( counter => {
      if (state.counterList.indexOf(counter.name) < 0) {
        state.counterList.push(counter.name)
      }
      counter.counters.map( count => {
        let nc = {
          ...count,
          name: counter.name,
          type: counter.countertype.name,
          tgl: this.$moment(count.waktu, this.$moment.ISO_8601).format('DD-MM-YYYY'),
          bln: this.$moment(count.waktu, this.$moment.ISO_8601).format('MMMM YYYY'),
          isMonth: !!!Number(this.$moment(count.waktu, this.$moment.ISO_8601).format('HHmmssss'))
        }
        if(nc.isMonth){
          state.counter[nc.name] && state.counter[nc.name].length 
            ? state.counter[nc.name] = [...state.counter[nc.name], nc.bln]
            : state.counter[nc.name] = [nc.bln]
          state.bln[`${nc.name} ${nc.bln}`] = nc
        } else {
          state.tgl[`${nc.name} ${nc.tgl}`] = nc
        }
      })
      
    })
  }
};

export const getters = {
  gettgl: ({tgl}) => ({name, tanggal}) => tgl[`${name} ${tanggal}`],
  getbln: ({bln}) => ({ name, bulan}) => bln[`${name} ${bulan}`]
};

export const actions = {
  async counterTimeName(store, {pembilang, penyebut}) {
    const res = await Promise.all([...[pembilang, penyebut].map( vars => {
      return strapi.request("post", "/graphql", {
        data: {
          query,
          variables: {
            id: vars.id,
            from: vars.from, 
            to: vars.to
          }
        }
      })
    })])
    store.commit('save', res.map(({data:{countername}}) => countername))
  }
}