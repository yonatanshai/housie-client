import React from 'react';
import HouseMembersList from '../components/house-members-list';
import './house-dashboard.css';
import TasksList from '../../tasks/components/tasks-list';
import ExpensesList from '../../expenses/components/expenses-list';
import { BrowserRouter, Switch } from 'react-router-dom';
import PrivateRoute from '../../routes/private-route';

const HouseDashBoard = ({ house }) => {
    const handleAddMember = ({values, houseId}) => {
        alert(houseId + ' ' + values.email);
    }
    return (
        <div className="house-dashboard">
            <h2 className="house-dashboard__title">{house.name}</h2>
            <div className="house-dashboard__widgets">
                <HouseMembersList house={house} members={house.members} admins={house.admins} onAddMember={handleAddMember} />
                <TasksList house={house} />
                {/* <ExpensesList expenses={house.expenses} /> */}
            </div>
        </div>
    )
};

export default HouseDashBoard;