import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './components/AppContainer'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import gameApp from './reducers.js'

import levels from './levels.js'

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

let store = createStore(gameApp, initialState,  applyMiddleware(logger));

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>, 
    document.getElementById("root")
);
