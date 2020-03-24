import React, { useState } from 'react';
import Widget from '../../shared/components/ui-elements/widget';
import ExpensesListItem from './expenses-list-item';
import './expenses-list.css';
import Icon from '../../shared/components/ui-elements/icon';
import Button from '../../shared/components/form-elements/button';
import IconTextLabel from '../../shared/components/ui-elements/icon-text-label';
import Modal from '../../shared/components/ui-elements/modal';
import CreateExpenseForm from './create-expense-form';
import moment from 'moment';
import TextInput from '../../shared/components/form-elements/text-input';

const ExpensesList = ({ expenses, house, ...props }) => {
    const [expensesData, setExpensesData] = useState(expenses);
    const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);
    const [filtersSearchText, setFiltersSearchText] = useState(undefined);

    const toggleShowCreateExpenseForm = () => {
        setShowCreateExpenseForm(!showCreateExpenseForm);
    }

    const handleCreateExpense = ({ title, description, amount }) => {
        toggleShowCreateExpenseForm();
        setExpensesData([
            ...expensesData,
            { id: expensesData.length + 1, title, amount, createdAt: moment().format('LL') }
        ])
    }

    const handleDeleteExpense = (expenseId) => {
        const expenses = expensesData.filter(e => e.id !== expenseId);

        setExpensesData([...expenses]);
    }

    // const filterByName = (e) => {
    //     const val = e.target.value;
    //     setFiltersSearchText(val);

    // }

    return (
        <Widget className="expenses-list">
            <Modal isOpen={showCreateExpenseForm} onRequestClose={toggleShowCreateExpenseForm}>
                <CreateExpenseForm onSubmit={handleCreateExpense} />
            </Modal>
            <div className="expenses-list__title">
                <IconTextLabel icon="coin-dollar" text="Expenses" />
                <Button className="button--inverse" onClick={toggleShowCreateExpenseForm}>Create Expense</Button>
            </div>
            {/* <div className="expenses-list__filters">
                <div>
                    <input type="text" placeholder="Search by name" value={}/>
                </div>
                <div>
                    <input type="number" min="0" step="0.01" placeholder="Amount"/>
                    <select>
                        <option>Greater</option>
                        <option>Smaller</option>
                    </select>
                </div>

            </div> */}
            {expensesData.length === 0 ? <p>No Expenses</p> :
                expensesData.map(ex => <ExpensesListItem key={ex.id} expense={ex} onDelete={handleDeleteExpense} />)}
        </Widget>
    )
};

export default ExpensesList;