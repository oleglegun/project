import React from 'react'
import { Field, reduxForm } from 'redux-form'
import ErrorField from '../common/ErrorField'

class SignInForm extends React.Component {
    render() {
        const { handleSubmit } = this.props

        return (
            <div>
                <h2>Sign-In Form</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="login">Login (Email)</label>
                        <Field
                            name="email"
                            component={ErrorField}
                            type="text"
                            label="Email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <Field
                            name="password"
                            component={ErrorField}
                            type="password"
                            label="Password"
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
})(SignInForm)
