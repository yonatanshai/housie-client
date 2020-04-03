import React from 'react';
import './expense-stats.css';

function average(sum, count) {
    if (count === 0) {
        return 0;
    }
    return sum / count;
}

function sum(a) {
    let result = 0;
    a.forEach(a => result += a);
    return result;
}


const ExpenseStats = ({ expenses, ...props }) => {
    return (
        <div>
            <div>
                <h4>Total</h4>
                <span>{expenses.length}</span>
            </div>
            <div>
                <h4>Average</h4>
                <span>{average(sum(expenses.map(e => e.amount)), expenses.length).toFixed(2)}</span>
            </div>
        </div>
    )
};

export default ExpenseStats;