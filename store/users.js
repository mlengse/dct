import firebase from '~/node_modules/firebase/app'
import '~/node_modules/firebase/database'
import '~/node_modules/firebase/auth'

import { firebaseAction } from 'vuexfire'
/*
function createNewAccount(user) {
  return firebase.database().ref(`accounts/${user.uid}`).set({
    displayName: user.displayName || user.email.split('@')[0], // use part of the email as a username
    email: user.email,
    image: user.newImage || '/images/default-profile.png' // supply a default profile image for all users
  })
}
*/

export const state = () => ({
  user: null,
  account: null
})

export const getters = {
  isAuthenticated: ({ user }) => !!user,
  user: ({user}) => user,
  account: ({ account }) => account
}

export const actions = {
  setAccountRef: firebaseAction(({ bindFirebaseRef }, path) => {
    return bindFirebaseRef('account', firebase.database().ref(path))
  }),
/*
  userCreate({ state }, account) {
    return firebase.auth()
      .createUserWithEmailAndPassword(account.email, account.password)
      .then(({ user }) => {
        return createNewAccount(user)
      })
  },
  userGoogleLogin({ commit }) {
    firebase.auth().useDeviceLanguage()
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/plus.login')
    provider.setCustomParameters({
      'login_hint': 'user@example.com'
    })
    return firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        createNewAccount({
          newImage: result.additionalUserInfo.profile.picture, // just use their existing user image to start
          ...result.user
        })
        return commit('setUser', JSON.parse(JSON.stringify(result.user)))
      }).catch((error) => {
        console.log(error)
      })
  },
  userGithubLogin({ commit }) {
    firebase.auth().useDeviceLanguage()
    const provider = new firebase.auth.GithubAuthProvider()
    provider.addScope('user:email')
    return firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        createNewAccount({
          newImage: result.additionalUserInfo.profile.avatar_url, // just use their existing user image to start
          ...result.user
        })
        return commit('setUser', JSON.parse(JSON.stringify(result.user)))
      }).catch((error) => {
        console.log(error)
      })
  },
  userLogin({ state }, account) {
    return firebase.auth()
      .signInWithEmailAndPassword(account.email, account.password)
      .then((user) => {
        return this.commit('users/setUser', JSON.parse(JSON.stringify(user)))
      })
  },
*/
  userLogout({ state }) {
    return firebase.auth()
      .signOut()
      .then(() => {
        this.commit('users/resetUser')
      })
  },
/*
  userUpdate({ state }, newData) {
    return firebase.database().ref(`accounts/${state.user.uid}`).update({
      displayName: newData.displayName
    })
  },
  userUpdateImage({ state }, image) {
    return firebase.database().ref(`accounts/${state.user.uid}`).update({
      image
    })
  }
*/
}

export const mutations = {
  setUser(state, newUser) {
    //console.log(newUser)
    state.user = newUser
    return this.dispatch('users/setAccountRef', `accounts/${state.user.uid}`)
  },
  resetUser(state) {
    state.user = null
  },

}