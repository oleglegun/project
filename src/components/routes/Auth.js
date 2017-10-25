/* @flow */
import React from 'react'
import { Route, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signUp } from '../../ducks/auth'
import SignInForm from '../auth/SignInForm'
import SignUpForm from '../auth/SignUpForm'

type Props = {
    signUp: (email: string, password: string) => void,
}

class AuthPage extends React.Component<Props> {
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
                    render={() => <SignInForm onSubmit={this.handleSignIn} />}
                />
                <Route
                    path="/auth/signup"
                    render={() => <SignUpForm onSubmit={this.handleSignUp} />}
                />
            </div>
        )
    }

    handleSignIn = values => console.log('>>>', 'signIn', values)
    handleSignUp = ({ email, password }) => {
        this.props.signUp(email, password)
    }
}

export default connect(null, { signUp })(AuthPage)
