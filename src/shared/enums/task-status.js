export const TaskStatus = {
    New: 'new',
    Assigned: 'assigned',
    InProgress: 'inProgress',
    completed: 'completed'
}

const TaskStatusDisplayMap = new Map();
TaskStatusDisplayMap.set(TaskStatus.New, 'New');
TaskStatusDisplayMap.set(TaskStatus.Assigned, 'Assigned');
TaskStatusDisplayMap.set(TaskStatus.InProgress, 'In Progress');
TaskStatusDisplayMap.set(TaskStatus.completed, 'Completed');

export { TaskStatusDisplayMap }