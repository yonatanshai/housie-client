import React from 'react';
import './icon-text-button.css';
import Icon from '../ui-elements/icon';

const IconTextButton = props => {
    return (
        <button className={`icon-text-button ${props.className}`} type={props.type} onClick={props.onClick}>
            <Icon name={props.icon} className="icon-text-button__icon" />
            <span className="icon-text-button__text">{props.text}</span>
        </button>
    )
};

export default IconTextButton;