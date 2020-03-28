import React from 'react';
import './dashboard-item.css';

const DashboardItem = ({...props}) => {
    return (
        <div className="dashboard-item">
            <div className="dashboard-item__title">
                Title
            </div>
            <div className="dashboard-item__filters">
                Filters
            </div>
            <div className="dashboard-item__data">
                Data
            </div>
        </div>
    )
};

export default DashboardItem;