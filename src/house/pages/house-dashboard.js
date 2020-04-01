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
import ErrorModal from '../../shared/components/ui-elements/error-modal';

const HouseDashBoard = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [house, setHouse] = useState();
    const [error, setError] = useState(null);
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

    const handleAddMember = async ({ values, houseId }) => {
        setIsLoading(true);
        console.log({ values, houseId });
        const url = `${process.env.REACT_APP_API_BASE_URL}/house/${houseId}/members`;
        console.log(url);
        try {
            const res = await axios({
                method: 'POST',
                url,
                data: {
                    email: values.email
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            setHouse(res.data);

        } catch (error) {
            let statusCode = 0;
            if (error.request.response) {
                statusCode = JSON.parse(error.request.response).statusCode;
            }
            console.log(error.request.response)
            switch (statusCode) {
                case 400:
                    setError('You are already a member (duh!)')
                    break;
                case 401:
                    setError('Access denied. Please login');
                    break;
                case 404:
                    setError('A user with this email was not found')
                    break;
                default:
                    break;
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveMember = async (id) => {
        setIsLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_BASE_URL}/house/${house.id}/members/${id}`;
            const res = await axios({
                url,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            console.log(res.data);
            setHouse(res.data);
        } catch (error) {
            console.log(error)
            if (error && error.request && error.request.response) {
                const statusCode = JSON.parse(error.request.response).statusCode;

                switch (statusCode) {
                    case 400: 
                        setError('To remove yourself please go to setting -> exit group');
                        break;
                    case 401:
                        setError('Please login');
                        break;
                    case 404:
                        setError('Oops. User not found');
                        break;
                    default:
                        break;
                }
            }
        } finally {
            setIsLoading(false);
        }
    }

    const clearErrors = () => {
        setError(null);
    }

    if (isLoading) {
        return (<Loader />)
    } else {


        return (
            <div className="house-dashboard">
                <ErrorModal
                    isOpen={error}
                    buttonText="OK"
                    errorMessage={error}
                    onButtonClick={clearErrors}
                    title={"Error"}
                />
                {/* <h2 className="house-dashboard__title">{house.name}</h2> */}
                <Sidebar title={house.name}>
                    <NavLink
                        className="sidebar__item"
                        activeClassName="sidebar__item--active"
                        to={`${props.match.url}/members`}
                    >
                        <IconTextLabel textFirst text="Members" icon="users" />
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
                        to={`${props.match.url}/expenses`}
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
                            <HouseMembersList
                                house={house} 
                                members={house.members} 
                                admins={house.admins} 
                                onAddMember={handleAddMember} 
                                onRemoveMember={handleRemoveMember}/>
                        </PrivateRoute>
                        <PrivateRoute exact path={`${props.match.url}/tasks`}>
                            <TasksList house={house} />
                        </PrivateRoute>
                        <PrivateRoute exact path={`${props.match.url}/expenses`}>
                            <ExpensesList house={house} />
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