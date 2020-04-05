import React from 'react';
import './shopping-list.css';
import AddListItemForm from './add-list-item-form';
import ShoppingListItem from './shopping-list-item';
import Button from '../../shared/components/form-elements/button';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const ShoppingList = ({ list, ...props }) => {
    const handleAddItem = ({ name }) => {
        props.onAddItem({ name, listId: list.id });
    };

    const handleCheckItem = (itemId) => {
        updateItem({ itemId, checked: true });
    }

    const handleDeleteItem = (itemId) => {
        props.onDeleteItem({
            itemId,
            listId: list.id
        });
    }

    const updateItem = (values) => {
        props.onUpdateItem({ listId: list.id, itemId: values.id, ...values });
    }

    const archiveList = () => {
        props.onUpdate({ listId: list.id, isActive: false });
    }


    return (
        <CSSTransition
            classNames="display"
            timeout="1000"
        >
            <div className="shopping-list">
                <div className="shopping-list__title">
                    <h3 >{list.name}</h3>
                    <AddListItemForm onSubmit={handleAddItem} />
                    <p>Items: {list.items.filter(li => li.checked).length} / {list.items.length}</p>
                    <Button className="archive-list-button" onClick={archiveList}>Archive</Button>
                </div>

                {list.items.map(item => <ShoppingListItem
                    key={item.id}
                    item={item}
                    onItemCheck={handleCheckItem}
                    onItemDelete={handleDeleteItem}
                />)}
            </div>
        </CSSTransition>
    )
};

export default ShoppingList;