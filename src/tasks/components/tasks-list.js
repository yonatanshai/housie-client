import React, { useState, useEffect, useReducer } from 'react';
import './tasks-list.css';
import TasksListItem from './tasks-list-item';
import Widget from '../../shared/components/ui-elements/widget';
import Button from '../../shared/components/form-elements/button';
import IconTextLabel from '../../shared/components/ui-elements/icon-text-label';
import Modal from '../../shared/components/ui-elements/modal';
import CreateTaskForm from './create-task-form';
import moment from 'moment';
import { TaskStatus } from '../../shared/enums/task-status';
import { useAuth } from '../../context/auth-context';
import axios from 'axios';
import { TaskPriority } from '../../shared/enums/task-priority';
import Loader from '../../shared/components/ui-elements/loader';
import ErrorModal from '../../shared/components/ui-elements/error-modal';
import DateFilter from '../../shared/components/dashboard/date-filter';
import Dropdown from '../../shared/components/form-elements/dropdown';
import Checkbox from '../../shared/components/form-elements/checkbox';


const TasksList = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [fromDate, setFromDate] = useState(moment().startOf('month').toDate());
    const [toDate, setToDate] = useState(moment().endOf('day').toDate());
    const [filterStatus, setFilterStatus] = useState('Active');
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const { userData } = useAuth();

    useEffect(() => {
        const getTasks = async () => {
            setIsLoading(true);
            let url = `${process.env.REACT_APP_API_BASE_URL}${process.env.REACT_APP_GET_TASKS_URL}/${props.house.id}?fromDate=${fromDate.toISOString()}&toDate=${toDate.toISOString()}`;
            if (filterStatus !== TaskStatus.completed) {
                url = url + `&openOnly=true`;
            }
            console.log(url)
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
                console.log(error)
                // const response = JSON.parse(error.request.response);
                // if (response.statusCode === 401) {
                //     setErrors(`You can't access this house's tasks. Perhaps a login will do`)
                // }
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
        // const priority = TaskPriority.findIndex(p => p === values.priority.toLowerCase());
        // console.log({ priority, p: values.priority });

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
            setIsLoading(false)
        } catch (error) {

            console.log(error.request.response);
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

    const handleFilterStatusChanged = (status) => {
        if (status === TaskStatus.completed) {
            const newTasks = tasks.filter(t => t.status !== TaskStatus.completed);
            console.log(newTasks)
            setTasks(newTasks);
        }
        setFilterStatus(status);
    }

    return (
        <Widget className="tasks-list">
            <div className="tasks-list__title" onScrollCapture={() => alert('scrolled')}>
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
                
                    <div className="task-list__data">
                        <div className="filters">
                            <input type="text" placeholder="search" />
                            <DateFilter
                                fromDate={fromDate}
                                toDate={toDate}
                                onFromDateChange={handleFromDateChange}
                                onToDateChange={handleToDateChange}
                            />
                            {/* <label>Status</label>
                            <select>
                                <option>Assigned</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                            </select> */}
                            <Dropdown onSelect={handleFilterStatusChanged} value={filterStatus}>
                                <option value="1">Active</option>
                                {/* <option value={TaskStatus.InProgress}>In Progress</option> */}
                                <option value={TaskStatus.completed}>Completed</option>
                            </Dropdown>
                            <Button type="button" className="button--inverse button--inverse-success">Search</Button>
                        </div>
                        {tasks.length === 0 ? <p>No Tasks</p> : tasks.map(task => <TasksListItem key={task.id} task={task} onTaskCompleted={handleTaskCompleted} deleteTask={deleteTask} />)}
                    </div>
            }
        </Widget>
    )
};

export default TasksList;