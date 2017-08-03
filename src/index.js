import React from 'react'
import ReactDOM from 'react-dom'
import AppContainer from './view/App'
import Scoreboard from './view/Scoreboard'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import authReducer from './core/auth/reducers'
import gameReducer from './core/game/reducers'
import appReducer from './core/app/reducers'
import scoreboardReducer from './core/scoreboard/reducers'
import './core/database'
import saga from './core/sagas'
import initAuth from './core/auth/init'
import initGame from './core/app/init'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

const initialState = {
  app: { state: 'HOME' },
  scoreboard: { scores: [], userScores: [] },
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
  combineReducers({
    auth: authReducer,
    game: gameReducer,
    app: appReducer,
    scoreboard: scoreboardReducer,
    routing: routerReducer,
  }),
  initialState,
  composeEnhancers(applyMiddleware(sagaMiddleware, logger))
)

const history = syncHistoryWithStore(browserHistory, store)
sagaMiddleware.run(saga)

function render() {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={AppContainer} />
        <Route path="/scoreboard" component={Scoreboard} />
      </Router>
    </Provider>,
  document.getElementById("root")
  )
}

initAuth(store.dispatch)
  .then(initGame)
  .then(() => render())
  .catch(error => console.error(error))
