import React from 'react'
import { Route } from 'react-router-dom'
import SignIn from '../auth/SignIn'

const AuthPage = () => {
    return (
        <div>
            <h2>Auth Page</h2>
            <Route path="/auth/signin" component={SignIn} />
        </div>
    )
}

export default AuthPage
