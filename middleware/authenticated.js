
export default async function ({
  isServer,
  redirect
}) {
  let firebase = await import('firebase/app')
  // the server can never be authed for a single account
  if (isServer && !firebase.apps.length) {
    redirect('/account/login')
  }
}
