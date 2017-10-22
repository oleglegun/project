import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter as Router } from 'react-router-redux'
import App from './App'
import history from '../history'
import store from '../redux/index'

class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <App />
                </Router>
            </Provider>
        )
    }
}

export default Root
