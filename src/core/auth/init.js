import firebase from 'firebase'
import { signIn, initSuccessSignIn } from './actions'

export default function initAuth(dispatch) {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(signIn({ user }))
        dispatch(initSuccessSignIn())
      }

      resolve(dispatch)
    }, error => reject(error))
  })
}
