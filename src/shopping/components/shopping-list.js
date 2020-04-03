import React from 'react';
import './shopping-list.css';
import Button from '../../shared/components/form-elements/button';
import Icon from '../../shared/components/ui-elements/icon';
import AddListItemForm from './add-list-item-form';

const ShoppingList = ({ list, ...props }) => {
    const handleAddItem = ({name}) => {
        props.onAddItem({name, listId: list.id});
    };

    return (
        <div className="shopping-list">
            <div className="shopping-list__title">
                <h3 >{list.name}</h3>
                <AddListItemForm onSubmit={handleAddItem}/>
                <p>Items: {list.items.length}</p>
            </div>

        </div>
    )
};

export default ShoppingList;