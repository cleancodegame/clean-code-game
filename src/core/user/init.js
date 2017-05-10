import firebase from 'firebase'
import { initGame } from './actions'

export default function init(dispatch) {
  return new Promise(resolve => {
      dispatch(initGame())
      resolve()
    })
}
