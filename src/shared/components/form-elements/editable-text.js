import React, { useState } from 'react';
import './editable-text.css';

const MODE_TEXT = 'TEXT';
const MODE_EDIT = 'EDIT';



const EditableText = ({ mode, value, autoFocus, disabled, onChange, onBlur, ...props }) => {
    const handleChange = (e) => {
        onChange(e.target.value);
    }

    return (
        <div className="editable-text">
            {mode === MODE_EDIT && <input
                className="input"
                onChange={handleChange}
                onBlur={() => onBlur()}
                value={value}
                autoFocus={autoFocus}
                disabled={disabled}
            />}
            {mode !== MODE_EDIT && <span>{value}</span>}
        </div>
    )
};

export default EditableText;