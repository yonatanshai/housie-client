import React from 'react';
import './shopping-lists-list.css';
import { format } from 'date-fns';
import Button from '../../shared/components/form-elements/button';
import Icon from '../../shared/components/ui-elements/icon';
import { CSSTransition } from 'react-transition-group';

const ShoppingListsList = ({ list, selected, ...props }) => {
    const handleListClick = () => {
        props.onClick(list.id);
    }

    const handleDelete = () => {
        props.onDelete(list.id);
    }

    return (
        <li className={`list list--${selected ? 'active' : 'not-active'} ${!list.isActive && 'list--archived'}`} >
            <span className="list__name" onClick={handleListClick}>{list.name}</span>
            <span className="list__items-count">{list.items.length}</span>
            <span className="list__date">{format(new Date(list.createdAt), 'dd/MM/yyyy')}</span>
            <Button className="expenses-list-item__icon--cancel" onClick={handleDelete}>
                <Icon name="cancel-circle" />
            </Button>
        </li>
    )
};

export default ShoppingListsList;