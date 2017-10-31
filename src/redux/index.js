/* @flow */
import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
// import logger from 'redux-logger'
import reducer from './reducer'
import history from '../history'
import createSagaMiddleware from 'redux-saga'
import saga from './saga'
import type { SagaMiddleware } from 'redux-saga'

const sagaMiddleware: SagaMiddleware = createSagaMiddleware()

const enhancer = composeWithDevTools(
    applyMiddleware(routerMiddleware(history), sagaMiddleware)
)

const store = createStore(reducer, enhancer)

sagaMiddleware.run(saga)

window.store = store

export default store
