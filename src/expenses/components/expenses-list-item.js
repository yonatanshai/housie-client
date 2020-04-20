import React, { useState, useEffect } from 'react';
import Button from '../../shared/components/form-elements/button'
import './expenses-list-item.css'
import Icon from '../../shared/components/ui-elements/icon';
import { format } from 'date-fns';
import EditableText from '../../shared/components/form-elements/editable-text';
import ListItemSaveChanges from '../../shared/components/form-elements/list-item-save-changes';
import { useSettings } from '../../context/settings-context';
import { number } from 'currency-codes';


const ExpensesListItem = ({ expense, ...props }) => {
    // const initialState = {
    //     valuesChanged: false,
    //     title: expense.title,
    //     amount: expense.amount,
    //     isEditTitleActive: false,
    //     isEditAmountActive: false,
    // }

    const [isEditTitleActive, setIsEditTitleActive] = useState(false);
    const [isEditAmountActive, setIsEditAmountActive] = useState(false);
    const [title, setTitle] = useState(expense.title);
    const [amount, setAmount] = useState(expense.amount);
    const [valuesChanged, setValuesChanged] = useState(false);
    const { locale, currency } = useSettings();
    useEffect(() => {
        if (title === expense.title && parseFloat(amount) === expense.amount) {
            setValuesChanged(false);
        } else {
            setValuesChanged(true);
        }
    }, [title, amount, expense]);

    const handleDelete = () => {
        props.onDelete(expense.id);
    };

    const formatAmount = (amount) => {

        return Intl.NumberFormat(locale, {
            style: 'currency',
            currency: number(currency).code
        }).format(amount);
    }

    const handleEditChange = ({ value, name }) => {
        switch (name) {
            case 'title':
                setTitle(value);
                break;
            case 'amount':
                setAmount(value);
                break;
            default:
                break;
        }
    }



    const handleEditBlur = (name) => {
        switch (name) {
            case 'title':
                if (title.trim().length === 0) {
                    setTitle(expense.title);
                }
                setIsEditTitleActive(false);
                break;
            case 'amount':
                if (amount <= 0) {
                    setAmount(expense.amount);
                }
                setIsEditAmountActive(false);
                break;
            default:
                break;
        }
    }

    const handleCancelChanges = () => {
        setTitle(expense.title);
        setAmount(expense.amount);
    };

    const handleConfirmChanges = () => {
        setValuesChanged(false);
        props.onUpdate({
            expenseId: expense.id,
            title: title !== expense.title ? title : null,
            amount: amount !== expense.amount ? amount : null
        });

    };

    return (
        <div className={`expenses-list-item ${valuesChanged && 'expense-list-item--edited'}`}>
            <div className="expenses-list-item__title" onClick={() => setIsEditTitleActive(true)}>
                <EditableText
                    type="text"
                    autoFocus
                    value={title}
                    mode={isEditTitleActive ? 'EDIT' : 'TEXT'}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    name="title"
                />
            </div>
            <div className="expenses-list-item__amount" onClick={() => setIsEditAmountActive(true)}>
                <EditableText
                    type="number"
                    min="0"
                    step="0.01"
                    autoFocus
                    value={isEditAmountActive ? amount : formatAmount(amount)}
                    mode={isEditAmountActive ? 'EDIT' : 'TEXT'}
                    onChange={handleEditChange}
                    onBlur={handleEditBlur}
                    name="amount"
                />
            </div>
            <span className="expenses-list-item__date">{format(new Date(expense.createdAt), 'dd/MM/yyyy')}</span>
            <div className="expenses-list-item__actions">
                <Button className="expenses-list-item__icon--cancel" onClick={handleDelete}>
                    <Icon name="cancel-circle" />
                </Button>
            </div>
            {valuesChanged &&
                <ListItemSaveChanges onCancelChanges={handleCancelChanges} onConfirmChanges={handleConfirmChanges} />}
        </div>
    )
};

export default ExpensesListItem;