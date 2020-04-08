import React from 'react';
import HouseListItem from './house-list-item';
import './house-list.css';

const HouseList = props => {
    return (
        <ul className="house-list">
            {props.houses.map(house => <HouseListItem key={house.id} house={house} onClick={(id) => props.onHouseClicked(id)} />)}
        </ul>
    )
}

export default HouseList;