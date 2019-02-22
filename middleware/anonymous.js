export default async function ({
  isServer,
  store,
  redirect
}) {
  return await import('firebase/app').then( firebase => {
    if (!isServer && (store.getters['users/isAuthenticated'] && firebase.auth().currentUser)) {
      return redirect('/account')
    }
  })
}
