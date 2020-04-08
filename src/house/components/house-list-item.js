import React from 'react';
import './house-list-item.css';

const HouseListItem = ({ house, ...props }) => {
    return (
        <li className="house-list-item" onClick={() => props.onClick(house.id)}>
            <p className="house-name">{house.name}</p>
            <span className="house-member-count">{house.members.length} {house.members.length !== 1 ? 'members' : 'member'}</span>
        </li>
    )
}

export default HouseListItem;