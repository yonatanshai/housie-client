import React, { useState, useEffect } from 'react';
import HouseMembersList from '../components/house-members-list';
import './house-dashboard.css';
import TasksList from '../../tasks/components/tasks-list';
import ExpensesList from '../../expenses/components/expenses-list';
import { BrowserRouter, Switch, NavLink, Route, Redirect } from 'react-router-dom';
import PrivateRoute from '../../routes/private-route';
import { useAuth } from '../../context/auth-context';
import axios from 'axios';
import Sidebar from '../../shared/components/ui-elements/sidebar';
import Loader from '../../shared/components/ui-elements/loader';
import IconTextLabel from '../../shared/components/ui-elements/icon-text-label';

const HouseDashBoard = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [house, setHouse] = useState();
    const { userData } = useAuth();

    useEffect(() => {
        const fetchHouse = async () => {
            setIsLoading(true);
            try {
                const houseId = props.match.params.houseId;
                const res = await axios({
                    method: 'GET',
                    url: `${process.env.REACT_APP_API_BASE_URL}/house/${houseId}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`
                    }
                });
                setHouse(res.data);
            } catch (error) {
                console.log(error.request.response);
                if (error.request.response.statusCode === 401) {
                    return <Redirect to="/auth" />
                }
            }
        }
        fetchHouse();
    }, [userData.token, props.match.params.houseId]);

    useEffect(() => {
        if (house) {
            setIsLoading(false);
        }
    }, [house]);

    const handleAddMember = ({ values, houseId }) => {
        alert(houseId + ' ' + values.email);
    }

    if (isLoading) {
        return (<Loader />)
    } else {


        return (
            <div className="house-dashboard">
                {/* <h2 className="house-dashboard__title">{house.name}</h2> */}
                <Sidebar title={house.name}>
                    <NavLink
                        className="sidebar__item"
                        activeClassName="sidebar__item--active"
                        to={`${props.match.url}/members`}
                    >
                        <IconTextLabel textFirst text="Members" icon="man-woman" />
                    </NavLink>
                    <NavLink
                        className="sidebar__item"
                        activeClassName="sidebar__item--active"
                        to={`${props.match.url}/tasks`}
                    >
                        <IconTextLabel textFirst text="Tasks" icon="tasks" />
                    </NavLink>
                    <NavLink
                        className="sidebar__item"
                        activeClassName="sidebar__item--active"
                        to="/"
                    >
                        <IconTextLabel textFirst text="Expenses" icon="coin-dollar" />
                    </NavLink>
                    <NavLink
                        className="sidebar__item"
                        activeClassName="sidebar__item--active"
                        to="/"
                    >
                        <IconTextLabel textFirst text="Shopping" icon="cart" />
                    </NavLink>
                </Sidebar>
                <div className="house-dashboard__content">
                    <Switch>
                        <PrivateRoute exact path={`${props.match.url}/members`}>
                            <HouseMembersList house={house} members={house.members} admins={house.admins} onAddMember={handleAddMember} />
                        </PrivateRoute>
                        <PrivateRoute exact path={`${props.match.url}/tasks`}>
                            <TasksList house={house} />
                        </PrivateRoute>
                    </Switch>
                </div>
                {/* <HouseMembersList house={house} members={house.members} admins={house.admins} onAddMember={handleAddMember} />
                <TasksList house={house} /> */}
                {/* <ExpensesList expenses={house.expenses} /> */}
            </div>
        )
    }
};

export default HouseDashBoard;