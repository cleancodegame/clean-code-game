import firebase from 'firebase'
import { successSignIn } from './actions'

export default function initAuth(dispatch) {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(successSignIn({ user }))
      }

      resolve()
    }, error => reject(error))
  })
}
