import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'react-router-redux'
// import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducer'
import history from '../history'
import { composeWithDevTools } from 'redux-devtools-extension'
// import { composeWithDevTools } from 'remote-redux-devtools'

// const enhancer = applyMiddleware(routerMiddleware(history), thunk, logger)
// const composeEnhancers = composeWithDevTools({ realtime: true, port: 10000 })

const enhancer = composeWithDevTools(
    applyMiddleware(routerMiddleware(history), thunk)
)

const store = createStore(reducer, enhancer)

window.store = store

export default store
