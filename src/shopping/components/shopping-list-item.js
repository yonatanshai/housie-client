import React, { useState } from 'react';
import './shopping-list-item.css';
import Button from '../../shared/components/form-elements/button';
import Icon from '../../shared/components/ui-elements/icon';
import Checkbox from '../../shared/components/form-elements/checkbox';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const ShoppingListItem = ({ item, ...props }) => {
    const [checked, setChecked] = useState(item.checked);

    const handleEdit = () => {

    }

    const handleDelete = () => {
        props.onItemDelete(item.id);
    }

    const handleCheck = () => {
        setChecked(true);
        props.onItemCheck(item.id);
    }

    return (
        <div className="list-item">
            <span className="list-item__name">{item.name}</span>
            <div className="list-item__checkbox">
                <Checkbox
                    checked={checked}
                    onChange={handleCheck}
                    disabled={checked}
                />
            </div>
            <Button className="button--icon list-item__edit">
                <Icon name="pencil" />
            </Button>
            <Button className="button--icon list-item__delete" onClick={handleDelete}>
                <Icon name="cancel-circle" />
            </Button>
        </div>
    )
};

export default ShoppingListItem