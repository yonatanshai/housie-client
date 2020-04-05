import React, { useState, useEffect } from 'react';
import Widget from '../../shared/components/ui-elements/widget';
import ExpensesListItem from './expenses-list-item';
import './expenses-list.css';
import Button from '../../shared/components/form-elements/button';
import IconTextLabel from '../../shared/components/ui-elements/icon-text-label';
import Modal from '../../shared/components/ui-elements/modal';
import CreateExpenseForm from './create-expense-form';
import Axios from 'axios';
import { useAuth } from '../../context/auth-context';
import ErrorModal from '../../shared/components/ui-elements/error-modal';
import DateFilter from '../../shared/components/dashboard/date-filter';
import { subMonths, endOfDay, format, startOfDay } from 'date-fns';
import ExpenseStats from './expense-stats';

const ExpensesList = ({ house, ...props }) => {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fromDate, setFromDate] = useState(subMonths(new Date(), 1));
    const [toDate, setToDate] = useState(endOfDay(new Date()));
    const [maxAmount, setMaxAmount] = useState(null);
    const [minAmount, setMinAmount] = useState(null);
    const [filterMinAmount, setFilterMinAmount] = useState('');
    const [filterMaxAmount, setFilterMaxAmount] = useState('');
    const [showCreateExpenseForm, setShowCreateExpenseForm] = useState(false);
    // const [filtersSearchText, setFiltersSearchText] = useState(undefined);
    const [error, setError] = useState(null);
    const { userData } = useAuth();

    useEffect(() => {
        if (expenses) {
            setIsLoading(false);
        }
    }, [expenses]);

    useEffect(() => {
        const fetchExpenses = async () => {
            const from = format(startOfDay(fromDate), 'yyyy-MM-dd HH:mm:ss')
            const to = format(endOfDay(toDate), 'yyyy-MM-dd HH:mm:ss')
            let url = `${process.env.REACT_APP_API_BASE_URL}/expenses?houseId=${house.id}&fromDate=${from}&toDate=${to}`;

            if (minAmount) {
                url += `&greaterThan=${minAmount}`;
            }

            if (maxAmount) {
                url += `&smallerThan=${maxAmount}`;
            }

            console.log(url)
            try {
                setIsLoading(true);
                const res = await Axios({
                    method: 'GET',
                    url,
                    headers: {
                        'content-type': 'application/json',
                        'authorization': 'Bearer ' + userData.token
                    },
                });
                setExpenses(res.data)
            } catch (error) {
                console.log(error.request)
                setError('error');
            } finally {
                setIsLoading(false)
            }
        };
        fetchExpenses();
    }, [house, userData, fromDate, toDate, minAmount, maxAmount]);

    const toggleShowCreateExpenseForm = () => {
        setShowCreateExpenseForm(!showCreateExpenseForm);
    }

    const handleCreateExpense = async ({ title, description, amount }) => {
        const url = `${process.env.REACT_APP_API_BASE_URL}/expenses`;
        try {
            const res = await Axios({
                method: 'POST',
                url,
                data: JSON.stringify({
                    title,
                    description,
                    amount,
                    houseId: house.id
                }),
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                }
            });
            setExpenses([...expenses, res.data])
        } catch (error) {
            const e = JSON.parse(error.request.response);
            setError(e.error);
        }
        toggleShowCreateExpenseForm();
    }

    const handleDeleteExpense = async (expenseId) => {
        const url = `${process.env.REACT_APP_API_BASE_URL}/expenses/${expenseId}`;
        try {
            await Axios({
                method: 'DELETE',
                url,
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                }
            });

            setExpenses(expenses.filter(e => e.id !== expenseId));
        } catch (error) {
            const e = JSON.parse(error.request.response);
            setError(e.error);
        }
    }

    const clearError = () => {
        setError(null);
    }

    const handleFromDateChanged = (value) => {
        setFromDate(value);
    }

    const handleToDateChanged = (value) => {
        setToDate(value);
    }

    const handleMinAmountFilterChange = (e) => {
        setFilterMinAmount(e.target.value);
    }

    const handleMaxAmountFilterChange = (e) => {
        setFilterMaxAmount(e.target.value);
    }

    const resetFilters = () => {
        setFilterMinAmount('');
        setFilterMaxAmount('');
        setMinAmount(null);
        setMaxAmount(null);
    }

    const handleFilter = () => {
        
        filterMinAmount.trim().length > 0 ? setMinAmount(filterMinAmount) : setMinAmount(null);
        filterMaxAmount.trim().length > 0 ? setMaxAmount(filterMaxAmount) : setMaxAmount(null);
    }

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <Widget className="expenses-list">
            <ErrorModal
                isOpen={error}
                title="Error"
                buttonText="Ok"
                errorMessage={error}
                onButtonClick={clearError}
            />
            <Modal isOpen={showCreateExpenseForm} onRequestClose={toggleShowCreateExpenseForm}>
                <CreateExpenseForm onSubmit={handleCreateExpense} />
            </Modal>
            <div className="expenses-list__title">
                <IconTextLabel icon="coin-dollar" text="Expenses" />
                <Button className="button--inverse" onClick={toggleShowCreateExpenseForm}>Create Expense</Button>
            </div>
            <div className="filters">
                <DateFilter
                    fromDate={fromDate}
                    toDate={toDate}
                    onFromDateChange={handleFromDateChanged}
                    onToDateChange={handleToDateChanged}
                />
                <div className="filters-non-date">
                    <div className="amount-filter">
                        <input value={filterMinAmount} onChange={handleMinAmountFilterChange} min="0" className="number-input" type="number" name="amount" step="0.01" placeholder="greater than" />
                        <input value={filterMaxAmount} onChange={handleMaxAmountFilterChange} min="0" className="number-input" type="number" name="amount" label="Amount" step="0.01" placeholder="smaller than" />
                    </div>
                    <Button className="button--inverse-modify" onClick={handleFilter}>Filter</Button>
                    <Button className="button--inverse-gray" onClick={resetFilters}>Reset</Button>
                </div>
                <h4 style={{padding: '0 1rem', margin: '0'}}>Results: <span>{expenses.length}</span></h4>

            </div>
            <div className="expense-list__data">
                {expenses.length === 0 ? <p>No Expenses</p> :
                expenses.map(ex => <ExpensesListItem key={ex.id} expense={ex} onDelete={handleDeleteExpense} />)}
            </div>
            <ExpenseStats expenses={expenses}/>
        </Widget>
    )
};

export default ExpensesList;