import React, { useState } from 'react';
import './shopping-list.css';
import AddListItemForm from './add-list-item-form';
import ShoppingListItem from './shopping-list-item';
import Button from '../../shared/components/form-elements/button';
import Modal from '../../shared/components/ui-elements/modal';
import './archive-list-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import ArchiveListForm from './archive-list-form';
import {useAuth} from '../../context/auth-context';

const ShoppingList = ({ list, admins, ...props }) => {
    const [showArchiveDialog, setShowArchiveDialog] = useState(false);
    const [showAddToExpensesForm, setShowAddToExpensesForm] = useState(false);
    const {userData} = useAuth();

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

    const handleEditItem = (id) => {
        console.log(id);
    }

    const archiveList = (values) => {
        setShowAddToExpensesForm(false);
        setShowArchiveDialog(false);
        props.onUpdate({ listId: list.id, isActive: false, updateExpenses: !!values.amount, ...values });
    };

    const cancelArchive = () => {
        setShowAddToExpensesForm(false);
    }


    return (
        <div className="shopping-list">
            <Modal
                isOpen={showArchiveDialog}
                onRequestClose={() => setShowArchiveDialog(false)}
            >
                <div className="archive-dialog">
                    <h2 className="archive-dialog__title">Archive list</h2>

                    {showAddToExpensesForm ?
                        <ArchiveListForm
                            onSubmit={archiveList}
                            onCancel={cancelArchive}
                        />
                        :
                        <div className="archive-dialog__options">
                            <p>Would you like to add the list to your expenses?</p>
                            <div className="archive-dialog__actions">
                                <Button className="button--inverse-success" onClick={() => setShowAddToExpensesForm(true)}>Yes</Button>
                                <Button className="button--inverse-danger" onClick={archiveList}>No</Button>
                            </div>
                        </div>
                    }
                </div>
            </Modal>
            <div className="shopping-list__title">
                <h3 >{list.name}</h3>
                {list.isActive ? <AddListItemForm onSubmit={handleAddItem} /> : <div></div>}
                <p>Items: {list.items.filter(li => li.checked).length} / {list.items.length}</p>
                {list.isActive && admins.some(a => a.id === userData.user.id) &&
                    <Button className="archive-list-button" onClick={() => setShowArchiveDialog(true)}>Archive</Button>
                }
            </div>

            {list.items.map(item => <ShoppingListItem
                key={item.id}
                item={item}
                isActive={list.isActive}
                onItemCheck={handleCheckItem}
                onItemDelete={handleDeleteItem}
                onItemUpdate={updateItem}
            />)}
        </div>
    )
};

export default ShoppingList;