import firebaseConfig from '~/firebaseConfig'
import firebase from '~/node_modules/firebase/app'

if (!firebaseConfig) {
  throw new Error('missing firebaseConfig.js config.')
}

export default function ({
  store,
 // redirect
}) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }

  return firebase.auth().onAuthStateChanged( user => {
    if (user) {
     // let curr = firebase.auth().currentUser
     // console.log(JSON.stringify(curr) === JSON.stringify(user))
      store.commit('users/setUser', JSON.parse(JSON.stringify(user)))
    }
  })
}
