import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl || 'http://localhost:1337'
//const apiUrl = 'http://192.168.1.77:1337'

const strapi = new Strapi(apiUrl)

const query = `
query State($id: ID! $from: String! $to: String!){
  countername(id:$id){
    _id,
    name,
    countertype{
      _id,
      name
    }
    counters(where:{
      waktu_gte: $from,
      waktu_lte: $to
    }){
      _id,
      waktu,
      jumlah
    }
  }
}`

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
          //console.log(JSON.stringify(nc, null, 2))
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