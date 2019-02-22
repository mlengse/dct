import firebaseConfig from '~/firebaseConfig'

if (!firebaseConfig) {
  throw new Error('missing firebaseConfig.js config.')
}

export default async function ({
  store,
 // redirect
}) {

  let firebase = await import('firebase/app')
  await import('firebase/auth')
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
  
  return firebase.auth().onAuthStateChanged( user => {
    if (user) {
      // let curr = firebase.auth().currentUser
      // console.log(JSON.stringify(curr) === JSON.stringify(user))
      store.dispatch('users/setUser', JSON.parse(JSON.stringify(user)))
    }
  })
  
}
