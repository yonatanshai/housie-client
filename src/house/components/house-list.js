import React from 'react';
import HouseListItem from './house-list-item';

const HouseList = props => {
    return (
        <div>
            {props.houses.map(house => <HouseListItem name={house.name} />)}
        </div>
    )
}

export default HouseList;