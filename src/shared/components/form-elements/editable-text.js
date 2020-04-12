import React, { useState } from 'react';
import './editable-text.css';

const MODE_TEXT = 'TEXT';
const MODE_EDIT = 'EDIT';



const EditableText = ({
    mode,
    value,
    autoFocus,
    disabled,
    onChange,
    onBlur,
    type,
    step,
    min,
    name,
    ...props }) => {

    const handleChange = (e) => {
        onChange({value: e.target.value, name});
    }

    return (
        <div className="editable-text">
            {mode === MODE_EDIT && <input
                className="input"
                onChange={handleChange}
                onBlur={() => onBlur(name)}
                value={value}
                autoFocus={autoFocus}
                disabled={disabled}
                name={name}
                type={type}
                step={step}
                min={min}
            />}
            {mode !== MODE_EDIT && <span>{value}</span>}
        </div>
    )
};

export default EditableText;