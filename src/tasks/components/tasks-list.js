import React, { useState, useEffect, Fragment } from 'react';
import './tasks-list.css';
import TasksListItem from './tasks-list-item';
import Widget from '../../shared/components/ui-elements/widget';
import Button from '../../shared/components/form-elements/button';
import IconTextLabel from '../../shared/components/ui-elements/icon-text-label';
import Modal from '../../shared/components/ui-elements/modal';
import CreateTaskForm from './create-task-form';
import { TaskStatus } from '../../shared/enums/task-status';
import { useAuth } from '../../context/auth-context';
import axios from 'axios';
import Loader from '../../shared/components/ui-elements/loader';
import ErrorModal from '../../shared/components/ui-elements/error-modal';
import DateFilter from '../../shared/components/dashboard/date-filter';
import Dropdown from '../../shared/components/form-elements/dropdown';
import { format, startOfDay, endOfDay, subMonths } from 'date-fns';
import Icon from '../../shared/components/ui-elements/icon';
import Checkbox from '../../shared/components/form-elements/checkbox';

const statusRank = {
    'new': 0,
    'assigned': 1,
    'inProgress': 2,
    'completed': 3
}

const priorityRank = {
    'low': 0,
    'normal': 1,
    'high': 2
}

const sortTasks = (tasks, sortBy, sortDir) => {
    let sortedTasks = [...tasks];
    switch (sortBy) {
        case 'date':
            sortedTasks = [...tasks].sort((a, b) => {
                if (a.createdAt === b.createdAt) {
                    return 0;
                } else if (a.createdAt < b.createdAt) {
                    return sortDir === 'asc' ? -1 : 1;
                } else {
                    return sortDir === 'asc' ? 1 : -1;
                }
            });
            break;
        case 'title':
            sortedTasks = [...tasks].sort((a, b) => {
                if (a.title === b.title) {
                    return 0;
                } else if (a.title < b.title) {
                    return sortDir === 'asc' ? -1 : 1;
                } else {
                    return sortDir === 'asc' ? 1 : -1;
                }
            });
            break;
        case 'status':
            sortedTasks.sort((a, b) => {
                if (statusRank[a.status] === statusRank[b.status]) {
                    return 0;
                } else if (statusRank[a.status] < statusRank[b.status]) {
                    return sortDir === 'asc' ? -1 : 1;
                } else {
                    return sortDir === 'asc' ? 1 : -1;
                }
            })
            break;
        case 'priority':
            sortedTasks.sort((a, b) => {
                if (priorityRank[a.priority] === priorityRank[b.priority]) {
                    return 0;
                } else if (priorityRank[a.priority] < priorityRank[b.priority]) {
                    return sortDir === 'asc' ? -1 : 1;
                } else {
                    return sortDir === 'asc' ? 1 : -1;
                }
            })
            break;
        default:
            break;
    }
    return sortedTasks;
}


const TasksList = ({ ...props }) => {
    const { userData, setUserData } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [sortBy, setSortBy] = useState('date');
    const [sortDir, setSortDir] = useState('desc');
    const [isAdmin, setIsAdmin] = useState(props.house.admins.some(a => a.id === userData.user.id));
    const [fromDate, setFromDate] = useState(subMonths(new Date(), 1));
    const [toDate, setToDate] = useState(new Date());
    const [filterStatus, setFilterStatus] = useState('Active');
    const [filterTitle, setFilterTitle] = useState('');
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);



    useEffect(() => {
        const getTasks = async () => {
            setIsLoading(true);
            const from = format(startOfDay(fromDate), 'yyyy-MM-dd HH:mm:ss')
            const to = format(endOfDay(toDate), 'yyyy-MM-dd HH:mm:ss')
            let url = `${process.env.REACT_APP_API_BASE_URL}/tasks?houseId=${props.house.id}&fromDate=${from}&toDate=${to}`;
            if (filterStatus !== TaskStatus.completed) {
                url = url + `&openOnly=true`;
            }

            // if (filterTitle.trim().length > 0) {
            //     url = url + `&title=${filterTitle}`;
            // }

            try {
                const res = await axios({
                    url,
                    headers: {
                        'content-type': 'application/json',
                        'authorization': 'Bearer ' + userData.token
                    }
                });
                setTasks(sortTasks(res.data, 'date', 'desc'));
            } catch (error) {
                const { statusCode, message } = JSON.parse(error.request.response)
                setError({ code: statusCode, message });
            } finally {
                setIsLoading(false);
            }
        }

        getTasks();
    }, [userData.token, props.house.id, filterStatus, fromDate, toDate])

    const toggleShowCreateTaskForm = () => {
        setShowCreateTaskModal(!showCreateTaskModal);
    }

    const handleCreateTask = async (values) => {

        const assignee = values.assignee === '-' ? null : props.house.members.find(m => m.username === values.assignee);

        const url = process.env.REACT_APP_API_BASE_URL + '/tasks';

        const data = JSON.stringify({
            houseId: props.house.id,
            title: values.title,
            description: values.description || null,
            userToAssignId: assignee && assignee.id,
            priority: values.priority
        });

        try {
            const res = await axios({
                method: 'POST',
                url,
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                },
                data
            });
            setTasks([...tasks, res.data]);
            props.onAlertChange({
                message: 'Task Created',
                type: 'success'
            });
        } catch (error) {
            const { statusCode, message } = JSON.parse(error.request.response)
            setError({ code: statusCode, message });
        } finally {
            setIsLoading(false);
        }
        toggleShowCreateTaskForm();
    }

    const deleteTask = async (taskId) => {
        try {
            await axios({
                url: `${process.env.REACT_APP_API_BASE_URL}/tasks/${taskId}`,
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                }
            });
            setTasks(tasks.filter(task => task.id !== taskId));
            props.onAlertChange({
                message: 'Task Deleted',
                type: 'success'
            })
        } catch (error) {
            props.onAlertChange({
                message: 'Error Deleting',
                type: 'error'
            })
            const { statusCode, message } = JSON.parse(error.request.response)
            setError({ code: statusCode, message });
        } finally {
            setIsLoading(false);
        }
    }

    const handleUpdateStatus = async (taskId, status) => {
        try {
            const res = await axios({
                url: `${process.env.REACT_APP_API_BASE_URL}/tasks/${taskId}/status`,
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                },
                data: {
                    status
                }
            });
            const newTasks = tasks.map(t => t.id === taskId ? res.data : t);
            setTasks(newTasks);
        } catch (error) {
            const { statusCode, message } = JSON.parse(error.request.response)
            setError({ code: statusCode, message });
        }
    }

    const handleTaskUpdate = async ({ taskId, priority, user, title, description }) => {
        try {
            const res = await axios({
                method: 'PATCH',
                url: `${process.env.REACT_APP_API_BASE_URL}/tasks/${taskId}`,
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                },
                data: data = {
                    title,
                    priority,
                    description,
                    assignedUserId: user && user.id,
                }
            });
            setTasks(tasks.map(task => task.id === taskId ? res.data : task));
            props.onAlertChange({
                message: 'Task Updated!',
                type: 'success'
            })
        } catch (error) {
            const { statusCode, message } = JSON.parse(error.request.response)
            setError({ code: statusCode, message });
        }
    }


    const handleFromDateChange = (date) => {
        setFromDate(date);
    }

    const handleToDateChange = (date) => {
        setToDate(date);
    }

    const handleFilterTitleChange = (e) => {
        setFilterTitle(e.target.value);
    }

    const handleFilterStatusChanged = () => {
        const newStatusFilter = filterStatus === TaskStatus.completed ? 'Active' : TaskStatus.completed;
        if (newStatusFilter !== TaskStatus.completed) {
            const newTasks = tasks.filter(t => t.status !== TaskStatus.completed);
            setTasks(newTasks);
        }
        setFilterStatus(newStatusFilter);
    }

    const handleSortByChanged = (value) => {
        setSortBy(value);
    };

    const handleSortDirectionChanged = () => {
        setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    }

    const handleClearError = () => {
        if (error.code === 401 || error.code === 403) {
            setUserData(null);
        }
        setError(null);
    }

    useEffect(() => {
        setTasks(prev => sortTasks(prev, sortBy, sortDir));
    }, [sortDir, sortBy])

    if (error) {
        return (
            <ErrorModal
                isOpen={error}
                errorMessage={error.message}
                onButtonClick={handleClearError}
                title="Error"
                buttonText="Ok"
            />
        )
    }


    return (
        <Widget className="tasks-list">
            <div className="tasks-list__title">
                <Modal isOpen={showCreateTaskModal} onRequestClose={toggleShowCreateTaskForm}>
                    <CreateTaskForm
                        house={props.house}
                        onSubmit={handleCreateTask} />
                </Modal>
                <IconTextLabel icon="tasks" text="Tasks" />
                {isAdmin && <Button className="button button--inverse" onClick={toggleShowCreateTaskForm}>Create Task</Button>}
            </div>
            {isLoading ? <Loader /> :
                <Fragment>
                    <div className="filters">
                        <DateFilter
                            fromDate={fromDate}
                            toDate={toDate}
                            onFromDateChange={handleFromDateChange}
                            onToDateChange={handleToDateChange}
                        />
                        <div className="filters__non-date">
                            <input className="search" type="text" value={filterTitle} placeholder="Search by title" onChange={handleFilterTitleChange} />
                            {/* <Dropdown onSelect={handleFilterStatusChanged} value={filterStatus}>
                                <option value="1">Active</option>
                                <option value={TaskStatus.completed}>Completed</option>
                            </Dropdown> */}
                            <Checkbox label="Completed" checked={filterStatus === TaskStatus.completed} onChange={handleFilterStatusChanged} />

                            <Dropdown label="Sort By:" onSelect={handleSortByChanged} value={sortBy}>
                                <option value="date">Date</option>
                                <option value="title">Title</option>
                                <option value="status">Status</option>
                                <option value="priority">Priority</option>
                            </Dropdown>

                            <Button className="button--icon" onClick={handleSortDirectionChanged}>
                                <Icon name={`${sortDir === 'asc' ? 'move-up' : 'move-down'}`} />
                            </Button>
                            {/* <Button type="button" className="button--inverse button--inverse-success">Search</Button> */}
                        </div>
                        <span style={{ padding: '0 1rem', fontWeight: '600' }}>{`Results: ${tasks.length}`}</span>
                    </div>
                    <div className="task-list__data">
                        {tasks.length === 0 ? <p>No Tasks</p> :
                            tasks.map(task =>
                                <TasksListItem
                                    key={task.id}
                                    task={task}
                                    members={props.house.members}
                                    admins={props.house.admins}
                                    onUpdate={handleTaskUpdate}
                                    onUpdateStatus={handleUpdateStatus}
                                    deleteTask={deleteTask} />)}
                    </div>
                </Fragment>
            }
        </Widget>
    )
};

export default TasksList;