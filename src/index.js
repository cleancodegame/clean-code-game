import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './components/AppContainer'
import thunk from 'redux-thunk'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { getFirebase, reactReduxFirebase  } from 'react-redux-firebase'
import gameReducer from './reducers.js'

const initialState = {
    state: 'HOME'
};

const logger = store => next => action => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}

const store = createStore(gameReducer, initialState,  applyMiddleware(logger));

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById("root")
);
