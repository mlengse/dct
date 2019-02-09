import firebase from 'firebase/app'

export default function ({
  isServer,
  store,
  redirect
}) {
  if (!isServer && (store.getters['users/isAuthenticated'] && firebase.auth().currentUser)) {
    return redirect('/account')
  }
}
