/* @flow */
import React from 'react'
import { Field, reduxForm } from 'redux-form'
import type { FormProps } from 'redux-form'
import emailValidator from 'email-validator'
import ErrorField from '../common/ErrorField'

type Props = {} & FormProps

function AddPeopleForm({ handleSubmit, invalid }: Props) {
    return (
        <div>
            <h2>People</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <Field
                        label="First Name"
                        name="firstName"
                        component={ErrorField}
                        type="text"
                    />
                </div>
                <div>
                    <Field
                        label="Last Name"
                        name="lastName"
                        component={ErrorField}
                        type="text"
                    />
                </div>
                <div>
                    <Field
                        name="email"
                        label="Email"
                        component={ErrorField}
                        type="text"
                    />
                </div>
                <button type="submit" disabled={invalid}>
                    Save
                </button>
            </form>
        </div>
    )
}

const validate = ({ firstName, lastName, email }) => {
    const errors = {}

    if (!firstName) errors.firstName = 'First Name is required'
    if (!lastName) errors.lastName = 'Last Name is required'
    if (!email) errors.email = 'Email is required'
    else if (!emailValidator.validate(email))
        errors.email = 'Email is not valid'

    return errors
}

export default reduxForm({
    form: 'addPerson',
    validate,
})(AddPeopleForm)
