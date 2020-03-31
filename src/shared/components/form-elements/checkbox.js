import React from 'react';
import './checkbox.css';

const Checkbox = props => {
    return (
        <div>
            <label>{props.label}</label>
            <input data-tip={props.dataTip} disabled={props.disabled} className={`checkbox ${props.className}`} type="checkbox" checked={props.checked} onChange={props.onChange} />
        </div>
    )
};

export default Checkbox;