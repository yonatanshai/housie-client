import React from 'react';
import Button from '../../shared/components/form-elements/button'
import './expenses-list-item.css'
import Icon from '../../shared/components/ui-elements/icon';
import { format } from 'date-fns';

const ExpensesListItem = ({ expense, ...props }) => {

    const handleDelete = () => {
        props.onDelete(expense.id);
    };

    const formatAmount = (amount) => {
        return Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    return (
        <div className="expenses-list-item">
            <span className="expenses-list-item__title">{expense.title}</span>
            <span className="expenses-list-item__amount">{formatAmount(expense.amount)}</span>
            <span className="expenses-list-item__date">{format(new Date(expense.createdAt), 'dd/MM/yyyy')}</span>
            <div className="expenses-list-item__actions">
                <Button className="expenses-list-item__icon--cancel" onClick={handleDelete}>
                    <Icon name="cancel-circle"  />
                </Button>

            </div>
        </div>
    )
};

export default ExpensesListItem;