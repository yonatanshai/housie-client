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


const TasksList = ({ ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const { userData } = useAuth();

    useEffect(() => {
        const getTasks = async () => {
            setIsLoading(true);
            const url = process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_GET_TASKS_URL + `/${props.house.id}`;

            try {
                const res = await axios({
                    url,
                    headers: {
                        'content-type': 'application/json',
                        'authorization': 'Bearer ' + userData.token
                    }
                });
                setTasks(res.data)
                console.log(res.data)
            } catch (error) {
                const response = JSON.parse(error.request.response);
                if (response.statusCode === 401) {
                    setErrors(`You can't access this house's tasks. Perhaps a login will do`)
                }
            } finally {
                setIsLoading(false);
            }
        }

        getTasks();
    }, [userData.token, props.house.id])

    const toggleShowCreateTaskForm = () => {
        setShowCreateTaskModal(!showCreateTaskModal);
    }

    const handleCreateTask = async (values) => {
        setIsLoading(true);
        const assignee = props.house.members.find(m => m.username === values.assignee);
        const priority = TaskPriority.findIndex(p => p === values.priority.toLowerCase());

        const url = process.env.REACT_APP_API_BASE_URL + '/tasks';

        const data = JSON.stringify({
            houseId: props.house.id,
            title: values.title,
            description: values.description || null,
            userToAssignId: assignee.id,
            priority
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

    const handleTaskCompleted = (taskId) => {
        tasks.forEach(task => {
            if (task.id === taskId) {
                task.status = 3
                return;
            }
        })
    }

    const handleClearErrors = () => {
        setErrors(undefined);
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
                tasks.length === 0 ? <p>No Tasks</p> :
                    <div className="task-list__data">
                        <table >
                            <tbody>
                                <tr>
                                    <th>Title</th>
                                    <th>Create Date</th>
                                    <th>Status</th>
                                    <th>Priority</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                {tasks.map(task => <TasksListItem key={task.id} task={task} onTaskCompleted={handleTaskCompleted} deleteTask={deleteTask} />)}
                            </tbody>
                        </table>
                    </div>}

        </Widget>
    )
};

export default TasksList;