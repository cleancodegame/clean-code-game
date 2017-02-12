import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './components/AppContainer'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import gameReducer from './reducers'

import saga from './sagas'

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

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  gameReducer,
  initialState,
  applyMiddleware(sagaMiddleware, logger)
)

sagaMiddleware.run(saga)

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById("root")
);
