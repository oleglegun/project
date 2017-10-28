/* @flow */
import React from 'react'
import { Field, reduxForm } from 'redux-form'
import type { FormProps } from 'redux-form'
import emailValidator from 'email-validator'

type Props = {} & FormProps

function AddPeopleForm({ handleSubmit, invalid }: Props) {
    return (
        <div>
            <h2>People</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstName">First Name</label>
                    <Field
                        id="firstName"
                        name="firstName"
                        component="input"
                        type="text"
                    />
                </div>
                <div>
                    <label htmlFor="lastName">Last Name</label>
                    <Field
                        id="lastName"
                        name="lastName"
                        component="input"
                        type="text"
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <Field
                        id="email"
                        name="email"
                        component="input"
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

    if (!firstName) {
        errors.firstName = 'First Name is required'
    }

    if (!lastName) {
        errors.lastName = 'Last Name is required'
    }

    if (!email) {
        errors.email = 'Email is required'
    } else if (!emailValidator.validate(email)) {
        errors.email = 'Email is not valid'
    }

    return errors
}

export default reduxForm({
    form: 'addPeople',
    validate,
})(AddPeopleForm)
