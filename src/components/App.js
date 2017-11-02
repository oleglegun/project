import React, { Component } from 'react'
import { Route, NavLink } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminPage from './routes/Admin'
import AuthPage from './routes/Auth'
import PeoplePage from './routes/People'
import EventsPage from './routes/Events'

class App extends Component {
    render() {
        return (
            <div>
                <h1>App</h1>
                <ul>
                    <li>
                        <NavLink to="/auth" activeStyle={{ color: 'red' }}>
                            Auth Page
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin" activeStyle={{ color: 'red' }}>
                            Admin Page
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/people" activeStyle={{ color: 'red' }}>
                            People Page
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/events" activeStyle={{ color: 'red' }}>
                            Events Page
                        </NavLink>
                    </li>
                </ul>
                <ProtectedRoute path="/admin" component={AdminPage} />
                <ProtectedRoute path="/people" component={PeoplePage} />
                <ProtectedRoute path="/events" component={EventsPage} />
                <Route path="/auth" component={AuthPage} />
            </div>
        )
    }
}

export default App
