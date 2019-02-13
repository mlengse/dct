const indikator = ['kb', 'salinFaskes', 'imun', 'ab', 'jamban', 'rokok', 'asi', 'tumbuh', 'tb', 'ht', 'jkn', 'jiwa'];
const nilai = ['y', 'penyebut', 'iks'];

export const state = () => ({
  iksList: [],
  iks: {}
})

export const mutations = {
  add( { iks, iksList }, res){
    res => {
      res.map((e, i) => indikator.map(o => nilai.map(f => {
        if (f == 'penyebut' && e[o][f] == 0) res[i][o]['iks'] = null
      })))
    }
    for( let r of res) {
      iksList.indexOf(r._key) < 0 && iksList.push(r._key)
      iks[r._key] = r
    }
  }
}

export const getters = {
  iksList: ({ iksList, iks }) => iksList.map(iksId => iks[iksId]),
  iks: ({ iks }) => iksId => iks[iksId],
  kel: ({ iksList, iks }) => [...new Set(iksList.map(iksId => iks[iksId].kel))].sort(),
  rw: ({ iksList, iks }) => ({ kel }) => [...new Set(iksList.map(iksId => iks[iksId].kel === kel ? iks[iksId].rw === 'Semua' ? 'Semua' : Number(iks[iksId].rw) : 'Semua'))].sort((a, b) => a - b),
  rt: ({ iksList, iks }) => ({ kel, rw }) => [...new Set(iksList.map(iksId => iks[iksId].kel === kel ? iks[iksId].rw === rw ? iks[iksId].rt === 'Semua' ? 'Semua' : Number(iks[iksId].rt) : 'Semua' : 'Semua'))].sort((a, b) => a - b)
}

export const actions = {
  async all(store){
    let { data } = await this.$axios.get('https://fyyzavv98cy2ef0q.v1.p.beameio.net/api/iks', {}, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    store.commit('add', data)
  }
}