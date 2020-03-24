import React from 'react';
import Button from '../../shared/components/form-elements/button'
import './expenses-list-item.css'
import Icon from '../../shared/components/ui-elements/icon';

const ExpensesListItem = ({ expense, ...props }) => {

    const handleDelete = () => {
        props.onDelete(expense.id);
    };

    return (
        <div className="expenses-list-item">
            <span className="expenses-list-item__title">{expense.title}</span>
            <span className="expenses-list-item__amount">{expense.amount}$</span>
            <span className="expenses-list-item__date">{expense.createdAt}</span>
            <div className="expenses-list-item__actions">
                {/* <Button className="button button--inverse-danger">Delete</Button> */}
                <Button className="expenses-list-item__icon--cancel" onClick={handleDelete}>
                    <Icon name="cancel-circle"  />
                </Button>

            </div>
        </div>
    )
};

export default ExpensesListItem;