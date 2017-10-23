import React from 'react'
import { Field, reduxForm } from 'redux-form'

class SignIn extends React.Component {
    render() {
        const { handleSubmit } = this.props

        return (
            <div>
                <h2>Sign-In Form</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="login">Login</label>
                        <Field name="login" component="input" type="text" />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <Field
                            name="password"
                            component="input"
                            type="password"
                        />
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default reduxForm({
    form: 'signIn',
})(SignIn)
