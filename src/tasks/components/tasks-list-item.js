import React, { useState } from 'react';
import './tasks-list-item.css';
import Checkbox from '../../shared/components/form-elements/checkbox';
import { TaskStatus } from '../../shared/enums/task-status';
import Button from '../../shared/components/form-elements/button';
import Icon from '../../shared/components/ui-elements/icon';
import ReactTooltip from 'react-tooltip';
import {format} from 'date-fns';
import Dropdown from '../../shared/components/form-elements/dropdown';

const getUser = (userId, members) => {
    const member = members.find(m => m.id === userId);
    return member
}

const TasksListItem = ({ task, ...props }) => {
    const [isCompleted, setIsCompleted] = useState(task.status === 'completed');
    const [assignedUser, setAssignedUser] = useState(getUser(task.userId, props.members));
    const handleCompleteTask = () => {
        setIsCompleted(!isCompleted);
        props.onTaskCompleted(task.id);
    }

    const handleAssignUserClicked = () => {
        alert(assignedUser.id)
    }

    const handleDeleteTask = () => {
        props.deleteTask(task.id);
    }


    return (
        <div className="tasks-list-item">
            <span className="tasks-list-item__title">{task.title}</span>
            <span className="tasks-list-item__create-date">{format(new Date(task.createdAt), 'dd/MM/yyyy')}</span>
            
            <span data-tip="Task status" className={`tasks-list-item__status tasks-list-item__status--${task.status}`}>{task.status}</span>
            <ReactTooltip delayShow={500} />
            <span data-tip="Task Priority" className={`tasks-list-item__priority tasks-list-item__priority--${task.priority}`}>{task.priority}</span>
            <ReactTooltip delayShow={500} />

            <Dropdown value={assignedUser.id} className="tasks-list-item__user" onSelect={handleAssignUserClicked}>
                {props.members.map(m => <option key={m.id} value={m.id}>{m.username}</option>)}
            </Dropdown>

            <Checkbox dataTip="Complete task" className="tasks-list-item__complete-task" onChange={handleCompleteTask} checked={isCompleted} disabled={task.status === TaskStatus.completed} />
            <ReactTooltip delayShow={500} />

            <Button className="tasks-list-item__delete-task" onClick={handleDeleteTask}>
                <Icon name="cancel-circle" />
            </Button>
        </div>
    )
};

export default TasksListItem;