import React from 'react'

function ErrorField({ input, label, type, meta: { touched, error, warning } }) {
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
