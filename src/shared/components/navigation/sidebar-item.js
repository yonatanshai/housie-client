import React from 'react';
import './sidebar-item.css';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, ...props }) => {
    return (
        <NavLink
            to={to}
            className="sidebar__item"
            activeClassName="sidebar__item--active"
        >
            {props.children}
        </NavLink>
    )
};

export default SidebarItem;