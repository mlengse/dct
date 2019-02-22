import Strapi from 'strapi-sdk-javascript'

//const apiUrl = 'http://192.168.1.77:1337'

const apiUrl = process.env.apiUrl || 'http://localhost:1337'

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
  token: ({token}) => token
}

export const actions = {
  //setAccountRef: firebaseAction(({ bindFirebaseRef }, path) => {
  //  return bindFirebaseRef('account', firebase.database().ref(path))
  //}),
  async strapiLogin({ state }){
    let auth = await strapi.login(process.env.strapiUser, process.env.strapiPwd);
   // console.log(JSON.stringify(auth, null, 2))
    return state.commit('setAuth', auth)
    //return this.dispatch('users/setAccountRef', `accounts/${state.user.uid}`)
  },
  async userLogout({ state }) {
    return await import('firebase/app').then( firebase => {
      import('firebase/auth').then( ({ auth }) => {
        auth().signOut().then(() => {
          state.commit('resetUser')
        })
      })
    })
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
    return state.dispatch('strapiLogin')
  },
  resetUser(state) {
    state.user = null
  },

}