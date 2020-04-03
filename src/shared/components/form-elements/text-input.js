import React, { Fragment } from 'react';
import { useField } from 'formik';
import './text-input.css'

const TextInput = ({ label, value, step, orientation, hideError, ...props }) => {
    const [field, meta] = useField(props);
    let errorClass;

    if (meta.error && meta.touched) {
        errorClass = 'text-input--error';
    // } else if (meta.touched) {
    //     errorClass = 'text-input--error'
    } else {
        errorClass = 'text-input--valid'
    }
    return (
        <div className={`text-input-container text-input-container--${orientation}`}>
            {label && <label className="label" htmlFor={props.name}>{label}</label>}
            <input data-tip={props.dataTip} className="text-input" {...field} {...props} autoComplete={props.autoComplete} value={value} step={step} />
            {!hideError && <span className={errorClass}>{errorClass.includes('error') ? meta.error : '___'}</span>}
        </div>
    )
}

export default TextInput;