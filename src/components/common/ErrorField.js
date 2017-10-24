import React from 'react'
import type { FieldProps } from 'redux-form'

function ErrorField({
    input,
    label,
    type,
    meta: { touched, error, warning },
}: FieldProps) {
    console.log('---', input)
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
