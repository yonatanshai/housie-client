import React from 'react';
import Icon from './icon';
import './icon-text-label.css';

const IconTextLabel = ({ textFirst, showOnSmallScreen, ...props }) => {

    if (textFirst) {
        return (
            <div className={`icon-text-label ${props.className}`}>
                <span className={`icon-text-label__text ${showOnSmallScreen && 'icon-text-label__text--show-always'}`}>{props.text}</span>
                <Icon className="icon-text-label__icon" name={props.icon} />
            </div>
        )
    } else {
        return (

            <div className={`icon-text-label ${props.className}`}>
                <Icon className="icon-text-label__icon" name={props.icon} />
                <span className={`icon-text-label__text ${showOnSmallScreen && 'icon-text-label__text--show-always'}`}>{props.text}</span>
            </div>
        )
    }
};

export default IconTextLabel;