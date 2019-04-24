

export const state = () => ({
  user: null,
  account: null,
  login: false,
})

export const getters = {
  login:({login}) => login,
  isAuthenticated: ({ user }) => !!user,
  user: ({user}) => user,
  account: ({ account }) => account,
  idToken: ({ user }) => user.stsTokenManager.accessToken 
}

export const actions = {
  setUser({ commit }, user){
    commit('setUser', user)
  },
  async userLogout({ commit }) {
    let firebase = await import('firebase/app')
    await import('firebase/auth')
    await firebase.auth().signOut()
    return commit('resetUser')
  },
}

export const mutations = {
  closeLogin(state){
    state.login = false
  },
  openLogin(state){
    state.login = true
  },
  toggleLogin(state, val){
    state.login = val
  },
  setUser(state, newUser) {
    state.user = newUser
  },
  resetUser(state) {
    state.user = null
  },
}