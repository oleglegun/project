import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import AdminPage from './routes/Admin'

class App extends Component {
    render() {
        return (
            <div>
                <h1>Hello</h1>
                <Route path="/admin" component={AdminPage} />
            </div>
        )
    }
}

export default App
