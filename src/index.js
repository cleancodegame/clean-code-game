import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './components/AppContainer'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import gameReducer from './reducers'
import firebase from 'firebase'
import './database'
import saga from './sagas'
import { initAuth } from './actions/authActions'


const initialState = {
    state: 'HOME'
}

const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)

  return result
}

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  gameReducer,
  initialState,
  composeEnhancers(applyMiddleware(sagaMiddleware, logger))
)

sagaMiddleware.run(saga)

function render() {
  ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
  document.getElementById("root")
  )
}


initAuth(store.dispatch)
  .then(() => render())
  .catch(error => console.error(error))
