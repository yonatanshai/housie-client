import React from 'react';
import './house-list-item.css';
import Button from '../../shared/components/form-elements/button';
import Icon from '../../shared/components/ui-elements/icon';
import { useAuth } from '../../context/auth-context';

const HouseListItem = ({ house, ...props }) => {
    const { userData } = useAuth();
    const {admins} = house;

    const handleDelete = () => {
        props.onDelete(house.id);
    }

    return (
        <li className="house-list-item">
            {admins.some(a => a.id === userData.user.id) && <Icon name="user-tie" />}
            <p className="house-name" onClick={() => props.onClick(house.id)}>{house.name}</p>
            <span className="house-member-count">{house.members.length} {house.members.length !== 1 ? 'members' : 'member'}</span>
            <Button className="button--icon delete-house-button" onClick={handleDelete}>
                <Icon name="cancel-circle" />
            </Button>
        </li>
    )
}

export default HouseListItem;