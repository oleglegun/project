import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import AdminPage from './routes/Admin'
import AuthPage from './routes/Auth'
import PeoplePage from './routes/People'

class App extends Component {
    render() {
        return (
            <div>
                <h1>App</h1>
                <Route path="/admin" component={AdminPage} />
                <Route path="/auth" component={AuthPage} />
                <Route path="/people" component={PeoplePage} />
            </div>
        )
    }
}

export default App
