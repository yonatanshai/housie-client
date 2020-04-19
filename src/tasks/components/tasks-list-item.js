import React, { useState, useRef, useEffect } from 'react';
import './tasks-list-item.css';
import Checkbox from '../../shared/components/form-elements/checkbox';
import { TaskStatus } from '../../shared/enums/task-status';
import Button from '../../shared/components/form-elements/button';
import Icon from '../../shared/components/ui-elements/icon';
import ReactTooltip from 'react-tooltip';
import { format } from 'date-fns';
import Dropdown from '../../shared/components/form-elements/dropdown';
import { useAuth } from '../../context/auth-context';
import EditableText from '../../shared/components/form-elements/editable-text';
import ListItemSaveChanges from '../../shared/components/form-elements/list-item-save-changes';

const getUser = (userId, members) => {
    if (!userId) return null;
    const member = members.find(m => m.id === userId);
    return member
}

const isAdmin = (admins, userId) => {
    return admins.some(a => a.id === userId);
}

const TasksListItem = ({ task, members, ...props }) => {
    const [isCompleted, setIsCompleted] = useState(task.status === 'completed');
    const [assignedUser, setAssignedUser] = useState(getUser(task.userId, members));
    const [selectedPriority, setSelectedPriority] = useState(task.priority);
    const [showEditTitle, setShowEditTitle] = useState(false);
    const [title, setTitle] = useState(task.title);
    const { userData } = useAuth();
    const [valueChanged, setValueChanged] = useState(false);
    const [status, setStatus] = useState(task.status);

    useEffect(() => {
        setStatus(task.status);
        setAssignedUser(getUser(task.userId, members));
    }, [task.status, task.userId, members]);

    const handleCompleteTask = () => {
        setIsCompleted(!isCompleted);
        setStatus(TaskStatus.completed);
        props.onUpdateStatus(task.id, TaskStatus.completed);
    }

    const handleAssignUserClicked = (id) => {
        const member = getUser(parseInt(id), members);
        setAssignedUser(member);
        setValueChanged(true);
    };

    const handleCancelChanges = () => {
        setAssignedUser(getUser(task.userId, members))
        setSelectedPriority(task.priority);
        setTitle(task.title);
        setValueChanged(false);
    }

    const handleConfirmChanges = () => {
        setValueChanged(false);
        const priority = selectedPriority !== task.priority ? selectedPriority : null;
        const user = assignedUser && assignedUser.id !== task.userId ? assignedUser : null;
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
        if (isAdmin(props.admins, userData.user.id)) {
            setShowEditTitle(true);
        }
    }

    const handleTitleChanged = ({ value }) => {
        setTitle(value);
        setValueChanged(true);
    }

    const handleTitleBlur = () => {
        if (title.trim().length === 0) {
            setTitle(task.title)
        }
        setShowEditTitle(false);
    }

    const handleChangeStatusClicked = () => {
        if (status === TaskStatus.Assigned && assignedUser.id === userData.user.id) {
            props.onUpdateStatus(task.id, TaskStatus.InProgress);
        } else if (status === TaskStatus.New) {
            props.onUpdate({taskId: task.id, user: {id: userData.user.id}});
        }
    }


    const getStatusDataTip = () => {
        
        if (status === TaskStatus.Assigned && assignedUser && assignedUser.id === userData.user.id) {
            return 'Change to in progress'
        }

        if (status === TaskStatus.New) {
            return 'Signup'
        }
    }

    return (
        <div className={`tasks-list-item ${valueChanged && 'task-list-item--edited'}`}>
            <div className="title-container" data-tip="Double click to edit" onDoubleClick={handleTitleDoubleClicked} >
                <EditableText
                    value={title}
                    autoFocus
                    mode={showEditTitle ? 'EDIT' : 'TEXT'}
                    onBlur={handleTitleBlur}
                    onChange={handleTitleChanged}
                />
            </div>
            <ReactTooltip delayShow={500} />

            <span className="tasks-list-item__create-date">{format(new Date(task.createdAt), 'dd/MM/yyyy')}</span>

            <Button
                className={`tasks-list-item__status tasks-list-item__status--${status}`}
                dataTip={getStatusDataTip()}
                onClick={handleChangeStatusClicked} >
                {status}
            </Button>
            <ReactTooltip delayShow={500} />

            <Dropdown disabled={!isAdmin(props.admins, userData.user.id)} dataTip="Priority" onSelect={handlePriorityChanged} value={selectedPriority} className={`tasks-list-item__priority tasks-list-item__priority--${selectedPriority}`}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
            </Dropdown>
            <ReactTooltip delayShow={500} />

            <Dropdown
                disabled={!isAdmin(props.admins, userData.user.id)}
                value={assignedUser ? assignedUser.id : -1}
                className="tasks-list-item__user"
                onSelect={handleAssignUserClicked}>
                {assignedUser && members.map(m => <option key={m.id} value={m.id}>{m.username}</option>)}
                {!assignedUser && [...members, { id: -1, username: '-' }].map(m => <option key={m.id} value={m.id}>{m.username}</option>)}
            </Dropdown>

            <Checkbox dataTip="Complete task" className="tasks-list-item__complete-task" onChange={handleCompleteTask} checked={isCompleted} disabled={(task.status === TaskStatus.completed) || (task.userId !== userData.user.id)} />
            <ReactTooltip delayShow={500} />

            {isAdmin(props.admins, userData.user.id) &&
                <Button className="tasks-list-item__delete-task" onClick={handleDeleteTask}>
                    <Icon name="cancel-circle" />
                </Button>}
            {valueChanged &&
                <ListItemSaveChanges onConfirmChanges={handleConfirmChanges} onCancelChanges={handleCancelChanges} />
            }
        </div>
    )
};

export default TasksListItem;