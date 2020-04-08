import React, { Fragment } from 'react';

import './dropdown.css';

const Dropdown = ({ options, label, name, defaultValue, value, ...props }) => {
    const handleSelect = (e) => {
        props.onSelect(e.target.value);
    }
    
    return (
        <Fragment>
            {label && <label className="dropdown__label" htmlFor={name}>{label}</label>}
            <select data-tip={props.dataTip} placeholder="Status" className={`dropdown ${props.className}`} value={value} onChange={handleSelect}>
                {/* {options.map(option => <option className="dropdown__option" key={option.id} value={option.value}>{option.text}</option>)} */}
                {props.children}
            </select>
        </Fragment>
    )
}

export default Dropdown;