import React, { Fragment, useState } from 'react';
import './filter.css';
import { endOfDay, startOfMonth, endOfMonth } from 'date-fns';
import DateFilter from './date-filter';

const Filter = ({ withDateFilter, ...props }) => {
    const [fromDate, setFromDate] = useState(startOfMonth(new Date()));
    const [toDate, setToDate] = useState(endOfMonth(new Date()));

    const handleFromDateChanged = (date) => {
        setFromDate(date);
    }

    const handleToDateChanged = date => {
        setToDate(date);
    }

    const onFilter = (values) => {
        // props.onFilter()
        console.log(values);
    }

    return (
        <Fragment>
            {withDateFilter && <DateFilter
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={handleFromDateChanged}
                onToDateChange={handleToDateChanged} />
            }
            {props.children}
        </Fragment>
    )
};

export default Filter;