/* @flow */
import React from 'react'
import { Field, reduxForm } from 'redux-form'
import type { FormProps } from 'redux-form'
import emailValidator from 'email-validator'
import ErrorField from '../common/ErrorField'

type Props = {} & FormProps

class SignUpForm extends React.Component<Props> {
    render() {
        const { handleSubmit, invalid } = this.props

        return (
            <div>
                <h2>Sign-Up Form</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email</label>
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
                        <label htmlFor="passwordRepeat">Password</label>
                        <Field
                            name="passwordRepeat"
                            component={ErrorField}
                            type="password"
                            label="Repeat password"
                        />
                    </div>
                    <div>
                        <button type="submit" disabled={invalid}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}

const validate = ({ email, password, passwordRepeat }) => {
    const errors = {}

    if (!email) errors.email = 'Email is required'
    if (email && !emailValidator.validate(email))
        errors.email = 'Invalid email address'

    if (!password) errors.password = 'Enter password'
    if (password && password.length < 8) errors.password = 'Too short'

    if (!passwordRepeat) errors.passwordRepeat = 'Enter password'
    if (password !== passwordRepeat)
        errors.passwordRepeat = 'Passwords need to be equal'

    return errors
}

export default reduxForm({
    form: 'signUp',
    validate,
})(SignUpForm)
