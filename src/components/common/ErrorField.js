/* @flow */
import React from 'react'
import type { FieldProps } from 'redux-form'

type Props = {
    type: string,
    label: string,
} & FieldProps

function ErrorField({
    input,
    type,
    label,
    meta: { touched, error, warning },
}: Props) {
    console.log('---', input)
    //...input passes all props like focus
    return (
        <div>
            <input {...input} placeholder={label} type={type} />
            {touched &&
                ((error && <span style={{ color: 'red' }}>{error}</span>) ||
                    (warning && <span>{warning}</span>))}
        </div>
    )
}

export default ErrorField
