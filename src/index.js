import React from 'react'
import ReactDOM from 'react-dom'
import Root from './components/Root'
import registerServiceWorker from './registerServiceWorker'
// Run Firebase initialization
import './config'

ReactDOM.render(<Root />, document.getElementById('root'))
registerServiceWorker()
