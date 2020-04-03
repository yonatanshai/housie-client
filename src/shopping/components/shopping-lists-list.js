import React from 'react';
import './shopping-lists-list.css';
import { format } from 'date-fns';
import Button from '../../shared/components/form-elements/button';
import Icon from '../../shared/components/ui-elements/icon';

const ShoppingListsList = ({ list, selected, ...props }) => {
    const handleListClick = () => {
        props.onClick(list.id);
    }

    return (
        <div className={`list list--${selected ? 'active' : 'not-active'}`} onClick={handleListClick}>
            <span className="list__name">{list.name}</span>
            <span className="list__items-count">{list.items.length}</span>
            <span className="list__date">{format(new Date(list.createdAt), 'dd/MM/yyyy')}</span>
            <Button className="expenses-list-item__icon--cancel" onClick={() => alert(list.id)}>
                <Icon name="cancel-circle" />
            </Button>
        </div>
    )
};

export default ShoppingListsList;