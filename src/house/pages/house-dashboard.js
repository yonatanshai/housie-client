import React, { useState, useEffect } from 'react';
import HouseMembersList from '../components/house-members-list';
import './house-dashboard.css';
import TasksList from '../../tasks/components/tasks-list';
import ExpensesList from '../../expenses/components/expenses-list';
import { Switch, NavLink, Redirect } from 'react-router-dom';
import PrivateRoute from '../../routes/private-route';
import { useAuth } from '../../context/auth-context';
import axios from 'axios';
import Sidebar from '../../shared/components/ui-elements/sidebar';
import Loader from '../../shared/components/ui-elements/loader';
import IconTextLabel from '../../shared/components/ui-elements/icon-text-label';
import ErrorModal from '../../shared/components/ui-elements/error-modal';
import Shopping from '../../shopping/pages/shopping';
import SidebarItem from '../../shared/components/navigation/sidebar-item';
import Chat from '../../chat/pages/chat';
import { useAlert } from 'react-alert';
import Settings from '../../settings/pages/settings';
import Dialog from '../../shared/components/ui-elements/yes-no-dialog';

const HouseDashBoard = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [house, setHouse] = useState();
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null);
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
                const { statusCode, message } = JSON.parse(error.request.response);
                setError({ code: statusCode, message });
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
            const { statusCode, message } = JSON.parse(error.request.response);

            switch (statusCode) {
                case 400:
                    setError({ code: statusCode, message })
                    break;
                case 401:
                    setError({ code: statusCode, message: 'Access denied. Please login' });
                    break;
                case 404:
                    // setError({code: statusCode, message: 'A user with this email was not found'})
                    setShowAddMemberDialog(true);
                    break;
                default:
                    setError({ code: statusCode, message });
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
            setHouse(res.data);
        } catch (error) {
            if (error && error.request && error.request.response) {
                const { statusCode, message } = JSON.parse(error.request.response);

                switch (statusCode) {
                    case 400:
                        setError({ code: statusCode, message: 'To remove yourself please go to settings ;&rarr exit group' });
                        break;

                    default:
                        setError({ code: statusCode, message });
                        break;
                }
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleLeaveHouse = async (houseId) => {
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
            const e = JSON.parse(error.request.response);
            setError({ code: e.code, message: e.message });
        }
    }

    const handleMakeMemberAdmin = async (id) => {
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
            const e = JSON.parse(error.request.response);
            setError({ code: e.code, message: e.message });
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
        setError(null);
    }


    if (error) {
        return (
            <ErrorModal
                isOpen={error}
                buttonText="OK"
                errorMessage={error.message}
                onButtonClick={clearErrors}
                title={"Error"}
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
                    onPositive={() => console.log('adding user')}
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