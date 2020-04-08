import React from 'react';
import './alert-template.css';
import { options } from 'react-alert'
import Icon from './icon';
const AlertTemplate = ({ message, close, options, style, ...props }) => {
    return (
        <div style={style} className={
            `alert ${options.type === 'success' && 'alert--success'} ${options.type === 'error' && 'alert--error'}`
        }>
            {options.type === 'success' && <Icon name="checkmark" />}
            {message}
        </div>
    )
};

export default AlertTemplate;