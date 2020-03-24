import React, { Fragment } from 'react';

import './dropdown.css';
import { useField } from 'formik';

const Dropdown = ({ options, label, name, defaultValue, value, ...props }) => {
    
    return (
        <Fragment>
            {label && <label className="dropdown__label" htmlFor={name}>{label}</label>}
            <select className={`dropdown ${props.className}`} value={value} onSelect={props.onSelect}>
                {options.map(option => <option className="dropdown__option" key={option.id} value={option.value}>{option.text}</option>)}
            </select>
        </Fragment>
    )
}

export default Dropdown;