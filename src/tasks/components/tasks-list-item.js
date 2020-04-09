import React, { useState, useRef } from 'react';
import './tasks-list-item.css';
import Checkbox from '../../shared/components/form-elements/checkbox';
import { TaskStatus } from '../../shared/enums/task-status';
import Button from '../../shared/components/form-elements/button';
import Icon from '../../shared/components/ui-elements/icon';
import ReactTooltip from 'react-tooltip';
import { format } from 'date-fns';
import Dropdown from '../../shared/components/form-elements/dropdown';

const getUser = (userId, members) => {
    const member = members.find(m => m.id === userId);
    return member
}

const TasksListItem = ({ task, ...props }) => {
    const [isCompleted, setIsCompleted] = useState(task.status === 'completed');
    const [assignedUser, setAssignedUser] = useState(getUser(task.userId, props.members));
    const [selectedPriority, setSelectedPriority] = useState(task.priority);
    const [showEditTitle, setShowEditTitle] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [valueChanged, setValueChanged] = useState(false);

    const handleCompleteTask = () => {
        setIsCompleted(!isCompleted);
        props.onTaskCompleted(task.id);
    }

    const handleAssignUserClicked = (id) => {
        const member = getUser(parseInt(id), props.members);
        setAssignedUser(member);
        setValueChanged(true);
    };

    const handleCancelChanges = () => {
        setAssignedUser(getUser(task.userId, props.members))
        setSelectedPriority(task.priority);
        setTitle(task.title);
        setValueChanged(false);
    }

    const handleConfirmChanges = () => {
        setValueChanged(false);
        const priority = selectedPriority !== task.priority ? selectedPriority : null;
        const user = assignedUser.id !== task.userId ? assignedUser : null;
        const newTitle = title !== task.title ? title : null;

        if (priority || user || newTitle) {
            props.onUpdate({ taskId: task.id, priority, user, title });
        }
    }

    const handlePriorityChanged = (value) => {
        setValueChanged(true);
        setSelectedPriority(value);
    }

    const handleDeleteTask = () => {
        props.deleteTask(task.id);
    }

    const handleTitleDoubleClicked = () => {
        setShowEditTitle(true);
    }

    const handleTitleChanged = (e) => {
        setTitle(e.target.value);
        setValueChanged(true);
    }

    const handleTitleBlur = () => {
        if (title.trim().length === 0) {
            setTitle(task.title)
        }
        setShowEditTitle(false);
    }

    return (


        <div className={`tasks-list-item ${valueChanged && 'task-list-item--edited'}`}>
            <div className="title-container" data-tip="Double click to edit" onDoubleClick={handleTitleDoubleClicked} >
                {
                    showEditTitle ?
                        <input
                            className="tasks-list-item__title"
                            type="text"
                            value={title}
                            autoFocus
                            disabled={!showEditTitle}
                            onBlur={handleTitleBlur}
                            onChange={handleTitleChanged}
                        /> :
                        !showEditTitle && <span className="tasks-list-item__title">{title}</span>}
            </div>
            <ReactTooltip delayShow={500} />

            <span className="tasks-list-item__create-date">{format(new Date(task.createdAt), 'dd/MM/yyyy')}</span>

            <span data-tip="Task status" className={`tasks-list-item__status tasks-list-item__status--${task.status}`}>{task.status}</span>
            <ReactTooltip delayShow={500} />

            {/* <span data-tip="Task Priority" className={`tasks-list-item__priority tasks-list-item__priority--${task.priority}`}>{task.priority}</span> */}
            <Dropdown dataTip="Priority" onSelect={handlePriorityChanged} value={selectedPriority} className={`tasks-list-item__priority tasks-list-item__priority--${selectedPriority}`}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
            </Dropdown>
            <ReactTooltip delayShow={500} />

            <Dropdown value={assignedUser.id} className="tasks-list-item__user" onSelect={handleAssignUserClicked}>
                {props.members.map(m => <option key={m.id} value={m.id}>{m.username}</option>)}
            </Dropdown>

            <Checkbox dataTip="Complete task" className="tasks-list-item__complete-task" onChange={handleCompleteTask} checked={isCompleted} disabled={task.status === TaskStatus.completed} />
            <ReactTooltip delayShow={500} />

            <Button className="tasks-list-item__delete-task" onClick={handleDeleteTask}>
                <Icon name="cancel-circle" />
            </Button>
            {valueChanged &&
                <div className="changes-container">
                    <Button className="tasks-list-item__user-confirm" onClick={handleConfirmChanges}>
                        <Icon name="checkmark" />
                    </Button>
                    <Button className="tasks-list-item__cancel-changes" onClick={handleCancelChanges}>
                        <Icon name="cross" />
                    </Button>
                </div>
            }
        </div>
    )
};

export default TasksListItem;