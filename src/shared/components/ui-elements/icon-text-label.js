import React from 'react';
import Icon from './icon';
import './icon-text-label.css';

const IconTextLabel = ({ textFirst, ...props }) => {

    if (textFirst) {
        return (
            <div className={`icon-text-label ${props.className}`}>
                <span className="icon-text-label__text">{props.text}</span>
                <Icon className="icon-text-label__icon" name={props.icon} />
            </div>
        )
    } else {
        return (

            <div className={`icon-text-label ${props.className}`}>
                <Icon className="icon-text-label__icon" name={props.icon} />
                <span className="icon-text-label__text">{props.text}</span>
            </div>
        )
    }
};

export default IconTextLabel;