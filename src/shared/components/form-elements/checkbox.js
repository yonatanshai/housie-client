import React from 'react';
import './checkbox.css';

const Checkbox = props => {
    return (
        <input disabled={props.disabled} className={`checkbox ${props.className}`} type="checkbox" checked={props.checked} onChange={props.onChange} />
    )
};

export default Checkbox;