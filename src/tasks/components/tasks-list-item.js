import React, { useState } from 'react';
import './tasks-list-item.css';
import Checkbox from '../../shared/components/form-elements/checkbox';
import { TaskStatus } from '../../shared/enums/task-status';
import Button from '../../shared/components/form-elements/button';
import Icon from '../../shared/components/ui-elements/icon';
import moment from 'moment';
import { TaskPriority } from '../../shared/enums/task-priority';

const TasksListItem = ({ task, ...props }) => {
    const [isCompleted, setIsCompleted] = useState(task.status === 'completed');
    
    const handleCompleteTask = () => {
        setIsCompleted(!isCompleted);
        props.onTaskCompleted(task.id);
    }

    const handleAssignUserClicked = () => {
        // alert(task.user.name);
    }

    const handleDeleteTask = () => {
        props.deleteTask(task.id);
    }

    

    return (
        // <tr className={`tasks-list-item`}>
        <tr className={`tasks-list-item`}>
            <td className="tasks-list-item__title">{task.title}</td>
            <td className="tasks-list-item__create-date">{moment(task.createdAt).format('LL')}</td>
            <td className={`tasks-list-item__status tasks-list-item__status--${TaskStatus[task.status]}`}>{TaskStatus[task.status]}</td>
            <td className={`tasks-list-item__priority tasks-list-item__priority--${TaskPriority[task.priority]}`}>{TaskPriority[task.priority]}</td>
            {/* <select>
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
            </select> */}
            {/* <td>
                <Button className="button--link tasks-list-item__user " onClick={handleAssignUserClicked}>{task.user.name}</Button>
            </td> */}
            <td>
                <Checkbox className="tasks-list-item__complete-task" onChange={handleCompleteTask} checked={isCompleted} disabled={task.status === TaskStatus.Completed} />
            </td>
            <td>
                <Button className="tasks-list-item__delete-task" onClick={handleDeleteTask}>
                    <Icon name="cancel-circle"  />
                </Button>

            </td>
        </tr>
    )
};

export default TasksListItem;