import firebase from 'firebase'
import { signIn, successSignIn, initSuccessSignIn } from './actions'

let init = true

export default function initAuth(dispatch) {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(signIn({ user }))

        if (init) {
          dispatch(initSuccessSignIn())
        } else {
          dispatch(successSignIn())
        }
      }

      init = false

      resolve(dispatch)
    }, error => reject(error))
  })
}
