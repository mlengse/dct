import firebase from '~/node_modules/firebase/app'
import '~/node_modules/firebase/database'
import '~/node_modules/firebase/auth'

import { firebaseAction } from 'vuexfire'

export const state = () => ({
  user: null,
  account: null,
  login: false
})

export const getters = {
  login:({login}) => login,
  isAuthenticated: ({ user }) => !!user,
  user: ({user}) => user,
  account: ({ account }) => account
}

export const actions = {
  setAccountRef: firebaseAction(({ bindFirebaseRef }, path) => {
    return bindFirebaseRef('account', firebase.database().ref(path))
  }),
  userLogout({ state }) {
    return firebase.auth()
      .signOut()
      .then(() => {
        this.commit('users/resetUser')
      })
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
    return this.dispatch('users/setAccountRef', `accounts/${state.user.uid}`)
  },
  resetUser(state) {
    state.user = null
  },

}