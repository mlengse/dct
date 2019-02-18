export const state = () => ({
  spmList: [],
  spm: {},
  bagian: [],
})

export const getters = {
  spmList: ({ spmList, spm }) => spmList.map(spmId => spm[spmId]),
  spm: ({ spm }) => spmId => spm[spmId],
  bagian: ({ spmList, spm }) => [ 'Semua', ...[...new Set(spmList.map(spmId => spm[spmId].bagian))].sort()],
}

export const mutations = {
  addSpm({ spmList, spm}, res) {
    for (let r of res) {
      spmList.indexOf(r.kode) < 0 && spmList.push(r.kode)
      spm[r.kode] = r
    }
  },
}

export const actions = {
  async all( store, bulan){
    let { data } = await this.$axios.get(`${process.env.API_SIBELA}/api/capaian-${bulan}-${this.$moment().format('YYYY')}`, {}, {
      headers: {
        'Acess-Control-Allow-Origin': '*',
      }
    })
    store.commit('addSpm', data)

  }
}