import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import './date-filter.css';
import "react-datepicker/dist/react-datepicker.css";
import Button from '../form-elements/button';

const DateFilter = ({ onFromDateChange, onToDateChange, toDate, fromDate, ...props }) => {
    const handleThisMonth = () => {
        onFromDateChange(moment().startOf('month').toDate());
        onToDateChange(new Date());
    };

    const handleThisYear = () => {
        onFromDateChange(moment().startOf('year').toDate());
        onToDateChange(new Date());
    }

    const handleThisWeek = () => {
        onFromDateChange(moment().startOf('week').toDate());
        onToDateChange(new Date());
    }

    return (
        <div className="date-filter">
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
            <Button type="button" className="button--inverse-gray" onClick={handleThisWeek}>This Week</Button>
            <Button type="button" className="button--inverse-gray" onClick={handleThisMonth}>This Month</Button>
            <Button type="button" className="button--inverse-gray" onClick={handleThisYear}>This Year</Button>
        </div>
    )
};

export default DateFilter;