import firebaseConfig from '~/firebaseConfig'

if (!firebaseConfig) {
  throw new Error('missing firebaseConfig.js config.')
}

export default async function ({
  store,
 // redirect
}) {

  return await import('firebase/app').then(firebase => {
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
  
  })
}
