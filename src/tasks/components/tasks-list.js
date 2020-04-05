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


const TasksList = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [sortBy, setSortBy] = useState('date');
    const [sortDesc, setSortDesc] = useState(true);
    
    const [fromDate, setFromDate] = useState(subMonths(new Date(), 1));
    const [toDate, setToDate] = useState(new Date());
    const [filterStatus, setFilterStatus] = useState('Active');
    const [filterTitle, setFilterTitle] = useState('');
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

    const { userData } = useAuth();
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
                setTasks(res.data)
            } catch (error) {
                const response = JSON.parse(error.request.response);
                if (response.statusCode === 401) {
                    setErrors(`Seems like you need to login`)
                }
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
        setIsLoading(true);
        const assignee = props.house.members.find(m => m.username === values.assignee);

        const url = process.env.REACT_APP_API_BASE_URL + '/tasks';

        const data = JSON.stringify({
            houseId: props.house.id,
            title: values.title,
            description: values.description || null,
            userToAssignId: assignee.id,
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
        } catch (error) {

            setErrors(JSON.parse(error.request.response).message);
        } finally {
            setIsLoading(false);
        }
        toggleShowCreateTaskForm();
    }

    const deleteTask = async (taskId) => {
        setIsLoading(true);
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

        } catch (error) {
            alert('oops something went wrong');
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleTaskCompleted = async (taskId) => {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        let id;
        if (taskIndex !== -1) {
            id = tasks[taskIndex].id;
        }

        try {
            const res = await axios({
                url: `${process.env.REACT_APP_API_BASE_URL}/tasks/${id}/status`,
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                },
                data: {
                    status: TaskStatus.completed
                }
            });
            const newTasks = tasks.map(t => t.id === id ? res.data : t);
            setTasks(newTasks);
        } catch (error) {
            console.log(error.request);
        }
    }

    const handleClearErrors = () => {
        setErrors(undefined);
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

    const handleFilterStatusChanged = (status) => {
        if (status === TaskStatus.completed) {
            const newTasks = tasks.filter(t => t.status !== TaskStatus.completed);
            setTasks(newTasks);
        }
        setFilterStatus(status);
    }

    const handleSortByChanged = (value) => {
        sortTasks(value);
    };

    const handleSortDirectionChanged = () => {
        setSortDesc(prev => !prev);
        sortTasks(sortBy)
    }

    const sortTasks = (value) => {
        setSortBy(value);
        let sortedTasks;
        switch (value) {
            case 'date':
                sortedTasks = [...tasks].sort((a, b) => {
                    if (a.createdAt === b.createdAt) {
                        return 0;
                    } else if (a.createdAt < b.createdAt) {
                        return sortDesc ? 1 : -1;
                    } else {
                        return sortDesc ? -1 : 1;
                    }
                });
                setTasks(sortedTasks);
                break;
            case 'title':
                sortedTasks = [...tasks].sort((a, b) => {
                    if (a.title === b.title) {
                        return 0;
                    } else if (a.title < b.title) {
                        return sortDesc ? 1 : -1;
                    } else {
                        return sortDesc ? -1 : 1;
                    }
                });
                setTasks(sortedTasks);
                break;
            default:
                break;
        }
    }

    return (
        <Widget className="tasks-list">
            <div className="tasks-list__title">
                <ErrorModal
                    buttonText="Ok"
                    errorMessage={errors}
                    isOpen={errors}
                    onButtonClick={handleClearErrors}
                    title="Oops"
                />
                <Modal isOpen={showCreateTaskModal} onRequestClose={toggleShowCreateTaskForm}>
                    <CreateTaskForm house={props.house} onSubmit={handleCreateTask} />
                </Modal>
                <IconTextLabel icon="tasks" text="Tasks" />
                <Button className="button button--inverse" onClick={toggleShowCreateTaskForm}>Create Task</Button>
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
                            <Dropdown onSelect={handleFilterStatusChanged} value={filterStatus}>
                                <option value="1">Active</option>
                                {/* <option value={TaskStatus.InProgress}>In Progress</option> */}
                                <option value={TaskStatus.completed}>Completed</option>
                            </Dropdown>

                            <Dropdown label="Sort By:" onSelect={handleSortByChanged} value={sortBy}>
                                <option value="date">Date</option>
                                <option value="title">Title</option>
                                <option value="status">Status</option>
                                <option value="priority">Priority</option>
                            </Dropdown>

                            <div className={sortDesc ? "arrow-down" : "arrow-up"} onClick={handleSortDirectionChanged}></div>
                            {/* <Button type="button" className="button--inverse button--inverse-success">Search</Button> */}
                        </div>
                        <span style={{padding: '0 1rem', fontWeight: '600'}}>{`Results: ${tasks.length}`}</span>
                    </div>
                    <div className="task-list__data">
                        {tasks.length === 0 ? <p>No Tasks</p> : tasks.map(task => <TasksListItem key={task.id} task={task} members={props.house.members} onTaskCompleted={handleTaskCompleted} deleteTask={deleteTask} />)}
                    </div>
                </Fragment>
            }
        </Widget>
    )
};

export default TasksList;