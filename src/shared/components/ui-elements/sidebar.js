import React from 'react';
import './sidebar.css';

const Sidebar = ({title, ...props}) => {
    return (
        <aside className="sidebar">
            <h3 className="sidebar__title">{title}</h3>
            {props.children}
        </aside>
    )
}

export default Sidebar;