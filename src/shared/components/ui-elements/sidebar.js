import React from 'react';
import './sidebar.css';

const Sidebar = ({title, ...props}) => {
    return (
        <div className="sidebar">
            <h3 className="sidebar__title">{title}</h3>
            {props.children}
        </div>
    )
}

export default Sidebar;