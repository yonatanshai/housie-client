import React from 'react';
import './button.css'

const Button = props => {
    return (
        <button
            className={`button button--${props.styleType} ${props.className}`} data-tip={props.dataTip} type={props.type} onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    )
}

export default Button;