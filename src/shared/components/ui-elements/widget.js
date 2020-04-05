import React from 'react';
import './widget.css';

const Widget = (props) => {
    return (
        <div className={`widget ${props.className}`}>
            {props.children}
        </div>
    )
};

export default Widget;