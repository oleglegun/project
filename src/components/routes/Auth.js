import React from 'react'
import { Route } from 'react-router-dom'
import SignIn from '../auth/SignIn'

class AuthPage extends React.Component {
    render() {
        return (
            <div>
                <h2>Auth Page</h2>
                <Route
                    path="/auth/signin"
                    render={() => <SignIn onSubmit={this.handleSignIn} />}
                />
            </div>
        )
    }
    handleSignIn = values => console.log('>>>', 'signIn', values)
}

export default AuthPage
