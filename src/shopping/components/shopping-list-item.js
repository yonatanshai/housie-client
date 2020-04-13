import React, { useState, useEffect } from 'react';
import './shopping-list-item.css';
import Button from '../../shared/components/form-elements/button';
import Icon from '../../shared/components/ui-elements/icon';
import Checkbox from '../../shared/components/form-elements/checkbox';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import EditableText from '../../shared/components/form-elements/editable-text';
import ListItemSaveChanges from '../../shared/components/form-elements/list-item-save-changes';

const ShoppingListItem = ({ item, ...props }) => {
    const [checked, setChecked] = useState(item.checked);
    const [editTitle, setEditTitle] = useState(false);
    const [titleValue, setTitleValue] = useState(item.name);
    const [valuesChanged, setValuesChanged] = useState(false);

    useEffect(() => {
        if (titleValue === item.name) {
            setValuesChanged(false);
        } else {
            setValuesChanged(true);
        }
    }, [titleValue, item]);

    const handleEdit = () => {
        props.onItemEdit(item.id);
    }

    const handleDelete = () => {
        props.onItemDelete(item.id);
    }

    const handleCheck = () => {
        setChecked(true);
        props.onItemCheck(item.id);
    }

    const handleTitleChange = ({value}) => {
        setTitleValue(value);
    }

    const handleTitleEditBlur = () => {
        if (titleValue.trim().length > 0) {
            setEditTitle(false);
        }
    }

    const handleCancelChanges = () => {
        setTitleValue(item.name);
        setEditTitle(false);
    }

    const handleConfirmChanges = () => {
        if (titleValue !== item.name) {
            props.onItemUpdate({id: item.id, name: titleValue});
        }
    }

    return (
        <div className={`list-item ${valuesChanged && 'altered'}`}>
            <div onDoubleClick={() => setEditTitle(true)}>
                <EditableText 
                    value={titleValue}
                    mode={editTitle && props.isActive ? 'EDIT' : 'TEXT'}
                    autoFocus
                    disabled={!props.isActive}
                    onBlur={handleTitleEditBlur}
                    onChange={handleTitleChange}
                />
            </div>
            {/* <span className="list-item__name">{item.name}</span> */}
            <div style={{display: `${props.isActive ? 'block' : 'none'}`}} className={`list-item__checkbox`}>
                <Checkbox
                    checked={checked}
                    onChange={handleCheck}
                    disabled={checked || !props.isActive}
                />
            </div>
            <Button disabled={!props.isActive} className="button--icon list-item__delete" onClick={handleDelete}>
                <Icon name="cancel-circle" />
            </Button>
            {valuesChanged && props.isActive &&
                <ListItemSaveChanges onCancelChanges={handleCancelChanges} onConfirmChanges={handleConfirmChanges}/>
            }
        </div>
    )
};

export default ShoppingListItem