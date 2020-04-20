import React, { useState, useEffect } from 'react';
import HouseMembersList from '../components/house-members-list';
import './house-dashboard.css';
import TasksList from '../../tasks/components/tasks-list';
import ExpensesList from '../../expenses/components/expenses-list';
import { Switch, } from 'react-router-dom';
import PrivateRoute from '../../routes/private-route';
import { useAuth } from '../../context/auth-context';
import axios from 'axios';
import Sidebar from '../../shared/components/ui-elements/sidebar';
import Loader from '../../shared/components/ui-elements/loader';
import IconTextLabel from '../../shared/components/ui-elements/icon-text-label';
import ErrorModal from '../../shared/components/ui-elements/error-modal';
import Shopping from '../../shopping/pages/shopping';
import SidebarItem from '../../shared/components/navigation/sidebar-item';
import { useAlert } from 'react-alert';
import Settings from '../../settings/pages/settings';
import Dialog from '../../shared/components/ui-elements/yes-no-dialog';
import { useError } from '../../hooks/error-hook';

const HouseDashBoard = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [house, setHouse] = useState();
    const [isAdmin, setIsAdmin] = useState(false);
    // const [error, setError] = useState(null);
    const {error, handleError, setError, clearError} = useError();
    const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
    const { userData, setUserData } = useAuth();

    const alert = useAlert();

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
                handleError(error);
            }
        }
        fetchHouse();
    }, [userData.token, props.match.params.houseId]);

    useEffect(() => {
        if (house) {
            setIsLoading(false);
            setIsAdmin(house.admins.some(a => a.id === userData.user.id));
        }
    }, [house, userData]);

    const handleAddMember = async ({ values, houseId }) => {
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'POST',
                url: `${process.env.REACT_APP_API_BASE_URL}/house/${houseId}/members`,
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
            const { statusCode } = JSON.parse(error.request.response);
            if (statusCode === 404) {
                setShowAddMemberDialog(true);
            } else {
                handleError(error);
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveMember = async (id) => {
        setIsLoading(true);
        try {
            const res = await axios({
                url : `${process.env.REACT_APP_API_BASE_URL}/house/${house.id}/members/${id}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            setHouse(res.data);
        } catch (error) {
            if (error && error.request && error.request.response) {
                const { statusCode } = JSON.parse(error.request.response);
                switch (statusCode) {
                    case 400:
                        setError({ code: statusCode, message: 'To remove yourself please go to settings ;&rarr exit group' });
                        break;
                    default:
                        handleError(error);
                        break;
                }
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleLeaveHouse = async (houseId) => {
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_BASE_URL}/house/${houseId}/me`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            setHouse(res.data);
            props.history.push('/');
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleMakeMemberAdmin = async (id) => {
        setIsLoading(true);
        try {
            const res = await axios({
                method: 'POST',
                url: `${process.env.REACT_APP_API_BASE_URL}/house/${house.id}/admins/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            setHouse(res.data);
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }

    const showAlert = ({ message, type }) => {
        alert.show(message, {
            type
        })
    }

    const clearErrors = () => {
        const { code } = error;
        if (code === 401 || code === 403) {
            setUserData(null);
        }
        clearError();
    }


    if (error) {
        return (
            <Dialog 
                header="Error"
                type="OK"
                message={error.message}
                onPositive={clearErrors}
                show={!!error}

            />
        )
    }

    if (isLoading) {
        return (<Loader />)
    } else {
        return (
            <div className="house-dashboard">
                <Dialog
                    header="Invite member"
                    message="No user with this email was found. Would you like to send an invitation by email?"
                    show={showAddMemberDialog}
                    onNegative={() => setShowAddMemberDialog(false)}
                    onPositive={() => alert('not available yet :(')}
                    type="YesNo"
                />
                <Sidebar title={house.name}>
                    <SidebarItem to={`${props.match.url}/members`}>
                        <IconTextLabel textFirst text="Members" icon="users" />
                    </SidebarItem>
                    <SidebarItem to={`${props.match.url}/tasks`}>
                        <IconTextLabel textFirst text="Tasks" icon="tasks" />
                    </SidebarItem>
                    {isAdmin &&
                        <SidebarItem to={`${props.match.url}/expenses`}>
                            <IconTextLabel textFirst text="Expenses" icon="coin-dollar" />
                        </SidebarItem>}
                    <SidebarItem to={`${props.match.url}/shopping`}>
                        <IconTextLabel textFirst text="Shopping" icon="cart" />
                    </SidebarItem>
                    {/* <SidebarItem to={`${props.match.url}/chat`}>
                        <IconTextLabel textFirst text="Chat" icon="bubble" />
                    </SidebarItem> */}
                    <SidebarItem to={`${props.match.url}/settings`}>
                        <IconTextLabel textFirst text="Settings" icon="cog" />
                    </SidebarItem>
                </Sidebar>
                <div className="house-dashboard__content">
                    <Switch>
                        <PrivateRoute exact path={`${props.match.url}/members`}>
                            <HouseMembersList
                                house={house}
                                members={house.members}
                                admins={house.admins}
                                onAddMember={handleAddMember}
                                onMakeMemberAdmin={handleMakeMemberAdmin}
                                onRemoveMember={handleRemoveMember} />
                        </PrivateRoute>
                        <PrivateRoute exact path={`${props.match.url}/tasks`}>
                            <TasksList house={house} onAlertChange={showAlert} />
                        </PrivateRoute>
                        {isAdmin &&
                            <PrivateRoute exact path={`${props.match.url}/expenses`}>
                                <ExpensesList house={house} onAlertChange={showAlert} />
                            </PrivateRoute>}
                        <PrivateRoute exact path={`${props.match.url}/shopping`}>
                            <Shopping house={house} onAlertChange={showAlert} />
                        </PrivateRoute>
                        {/* <PrivateRoute exact path={`${props.match.url}/chat`}>
                            <Chat house={house} />
                        </PrivateRoute> */}
                        <PrivateRoute exact path={`${props.match.url}/settings`}>
                            <Settings house={house} onLeaveHouse={handleLeaveHouse} />
                        </PrivateRoute>
                    </Switch>
                </div>
            </div>
        )
    }
};

export default HouseDashBoard;