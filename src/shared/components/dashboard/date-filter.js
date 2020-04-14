import React from 'react';
import DatePicker from 'react-datepicker';
import './date-filter.css';
import "react-datepicker/dist/react-datepicker.css";
import Button from '../form-elements/button';
import { startOfMonth, endOfMonth, startOfYear, endOfYear, startOfWeek, endOfWeek } from 'date-fns'

const DateFilter = ({ onFromDateChange, onToDateChange, toDate, fromDate, ...props }) => {
    const handleThisMonth = () => {
        const start = startOfMonth(new Date());
        onFromDateChange(start);
        onToDateChange(endOfMonth(new Date()));
    };

    const handleThisYear = () => {
        onFromDateChange(startOfYear(new Date()));
        onToDateChange(endOfYear(new Date()));
    };

    const handleThisWeek = () => {
        onFromDateChange(startOfWeek(new Date()));
        onToDateChange(endOfWeek(new Date()));
    };

    return (
        <div className={`date-filter ${props.className}`}>
            <div className="date-filter__item">
                <label className="date-filter__item__label">From</label>
                <DatePicker
                    className="date-filter__picker"
                    selectsStart
                    selected={fromDate}
                    onChange={onFromDateChange} />
            </div>
            <div className="date-filter__item">
                <label className="date-filter__item__label">To</label>
                <DatePicker
                    className="date-filter__picker"
                    selected={toDate}
                    selectsEnd
                    onChange={onToDateChange}
                    minDate={fromDate}
                />
            </div>
            <div className="date-filter__preset-buttons">
                <Button type="button" className="button--inverse-gray" onClick={handleThisWeek}>This Week</Button>
                <Button type="button" className="button--inverse-gray" onClick={handleThisMonth}>This Month</Button>
                <Button type="button" className="button--inverse-gray" onClick={handleThisYear}>This Year</Button>
            </div>
        </div>
    )
};

export default DateFilter;