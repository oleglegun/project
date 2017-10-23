import React from 'react'
import { Route, NavLink } from 'react-router-dom'
import SignIn from '../auth/SignIn'
import SignUp from '../auth/SignUp'

class AuthPage extends React.Component {
    render() {
        return (
            <div>
                <h2>Auth Page</h2>
                <ul>
                    <li>
                        <NavLink
                            to="/auth/signin"
                            activeStyle={{ color: 'red' }}
                        >
                            Sign In
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/auth/signup"
                            activeStyle={{ color: 'red' }}
                        >
                            Sign Up
                        </NavLink>
                    </li>
                </ul>
                <Route
                    path="/auth/signin"
                    render={() => <SignIn onSubmit={this.handleSignIn} />}
                />
                <Route
                    path="/auth/signup"
                    render={() => <SignUp onSubmit={this.handleSignUp} />}
                />
            </div>
        )
    }
    handleSignIn = values => console.log('>>>', 'signIn', values)
    handleSignUp = values => console.log('>>>', 'signUp', values)
}

export default AuthPage
