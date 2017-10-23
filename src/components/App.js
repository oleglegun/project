import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import AdminPage from './routes/Admin'
import AuthPage from './routes/Auth'

class App extends Component {
    render() {
        return (
            <div>
                <h1>App</h1>
                <Route path="/admin" component={AdminPage} />
                <Route path="/auth" component={AuthPage} />
            </div>
        )
    }
}

export default App
