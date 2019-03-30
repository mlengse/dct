import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl 

const strapi = new Strapi(apiUrl)

export const state = () => ({
  user: null,
  account: null,
  login: false,
  auth: null,
  token: '',
  jwt:''
})

export const getters = {
  login:({login}) => login,
  isAuthenticated: ({ user }) => !!user,
  user: ({user}) => user,
  account: ({ account }) => account,
  token: ({token}) => token,
  idToken: ({user: { stsTokenManager: { accessToken }}}) => accessToken 
}

export const actions = {
  async setUser({ commit }, user){
    commit('setUser', user)
    let auth = await strapi.login(process.env.strapiUser, process.env.strapiPwd);
    return commit('setAuth', auth)

  },
  async userLogout({ commit }) {
    let firebase = await import('firebase/app')
    await import('firebase/auth')
    await firebase.auth().signOut()
    return commit('resetUser')
  },
}

export const mutations = {
  setAuth(state, val){
    state.auth = val.user
    state.jwt = val.jwt
    state.token = val.user._id
  },
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