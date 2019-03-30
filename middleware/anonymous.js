export default async function ({
  isServer,
  store,
  redirect
}) {
  let firebase = await import('firebase/app')
  if (!isServer && (store.getters['users/isAuthenticated'] && firebase.auth().currentUser)) {
    //return redirect('/account')
  } else {
    return redirect('/')
  }
}
