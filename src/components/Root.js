import React from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter as Router } from 'react-router-redux'
import App from './App'
import history from '../history'
import store from '../redux/index'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <DragDropContextProvider backend={HTML5Backend}>
                        <App />
                    </DragDropContextProvider>
                </Router>
            </Provider>
        )
    }
}

export default Root
