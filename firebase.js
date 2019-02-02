import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import config from '~/firebaseConfig.js'

if(!firebase.apps.length){
  firebase.initializeApp(config)
}

export const authProviders = {
  Google: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  Facebook: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  Twitter: firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  Email: firebase.auth.EmailAuthProvider.PROVIDER_ID,
  Phone: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
}

export default firebase

export const auth = firebase.auth()

export const db = firebase.database()

export const store = firebase.firestore()

