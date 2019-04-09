export const state = () => ({
  posyanduList: [],
  posyandu: {},
})

export const mutations = {
  add({ posyandu, posyanduList }, res) {
    res
    for (let r of res) {
      List.indexOf(r._key) < 0 && posyanduList.push(r._key)
      posyandu[r._key] = r
    }
  }
}

export const actions = {
  async all(store) {
    let { data } = await this.$axios.get(`${process.env.API_SIBELA}/graphql`, {}, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    store.commit('add', data)
  },
}