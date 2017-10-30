/* @flow */
import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
// import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducer'
import history from '../history'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import type { SagaMiddleware } from 'redux-saga'
import { saga } from '../ducks/people'

// import { composeWithDevTools } from 'remote-redux-devtools'
// const enhancer = applyMiddleware(routerMiddleware(history), thunk, logger)
// const composeEnhancers = composeWithDevTools({ realtime: true, port: 10000 })

const sagaMiddleware: SagaMiddleware = createSagaMiddleware()

const enhancer = composeWithDevTools(
    applyMiddleware(routerMiddleware(history), sagaMiddleware, thunk)
)

const store = createStore(reducer, enhancer)

// Run saga
// calls next on generators, passes to them objects, etc
sagaMiddleware.run(saga)

window.store = store

export default store
