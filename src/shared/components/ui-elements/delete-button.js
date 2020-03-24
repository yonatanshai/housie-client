import React from 'react';
import Icon from './icon';
import './delete-button.css'
import Button from '../form-elements/button';
const DeleteButton = ({onClick, ...props}) => {
    return (
        <Button onClick={onClick} className="delete-button">
            <Icon name="cancel-circle" className="delete-button__icon" />
        </Button>
    )
}

export default DeleteButton;