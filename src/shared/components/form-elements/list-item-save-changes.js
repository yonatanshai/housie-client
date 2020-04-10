import React from 'react';
import './list-item-save-changes.css';
import Button from './button';
import Icon from '../ui-elements/icon';

const ListItemSaveChanges = ({onCancelChanges, onConfirmChanges}) => {
    return (
        <div className="changes-container">
            <Button className="tasks-list-item__user-confirm" onClick={onConfirmChanges}>
                <Icon name="checkmark" />
            </Button>
            <Button className="tasks-list-item__cancel-changes" onClick={onCancelChanges}>
                <Icon name="cross" />
            </Button>
        </div>
    )
};

export default ListItemSaveChanges;