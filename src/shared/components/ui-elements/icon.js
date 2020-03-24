import React from 'react';
import './icon.css';

const Icon = (props) => {
    const iconPath = props.path ? props.path : `/images/symbol-defs.svg#icon-${props.name}`
    return (
        <svg className={`icon ${props.className}`}>
            {/* <use href={`/images/symbol-defs.svg#icon-${props.name}`}></use> */}
            <use href={iconPath}></use>
        </svg>
    )
};

export default Icon;