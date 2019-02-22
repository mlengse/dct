
export default async function ({
  isServer,
  redirect
}) {
  await import('firebase/app').then( firebase => {
    // the server can never be authed for a single account
    if (isServer && !firebase.apps.length) {
      redirect('/account/login')
    }

  })
}
