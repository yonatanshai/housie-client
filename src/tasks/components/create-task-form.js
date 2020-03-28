import React from 'react';
import './create-task-form.css';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import TextInput from '../../shared/components/form-elements/text-input';
import Dropdown from '../../shared/components/form-elements/dropdown';
import Button from '../../shared/components/form-elements/button';
import '../../shared/components/form-elements/dropdown.css';
import { TaskStatus } from '../../shared/enums/task-status';
import { TaskPriority } from '../../shared/enums/task-priority';

const CreateTaskForm = ({ house, ...props }) => {

    const handleSubmit = (values) => {
        props.onSubmit(values);
    };

    return (
        <Formik
            initialValues={{
                title: '',
                description: '',
                assignee: house.members[0].username,
                priority: TaskPriority.Normal
            }}
            validationSchema={yup.object({
                title: yup.string().min(2, 'Title too short (min: 2)').max(30, 'Title too long (max: 30)').required('Required'),
                description: yup.string().min(2, 'Description too short (min 2)').max(140, 'Description too long (max: 140)'),
                assignee: yup.string().required('Required'),
                priority: yup.string().required('Required')
            })}
            onSubmit={handleSubmit}
        >
            {({ errors, isSubmitting, values }) => (
                <Form className="create-task-form">
                    <h3 className="create-task-form__title">Create Task</h3>
                    <div className="create-task-form__content">
                        <TextInput type="text" name="title" label="Title" placeholder="title" autoComplete="off" />
                        <TextInput type="text" name="description" label="Description" placeholder="description" autoComplete="off" />
                        
                        <label htmlFor="assignee" className="dropdown__label">Assignee</label>
                        <Field className="dropdown" as="select" name="assignee"> 
                            {house.members.map(member => 
                            <option className="dropdown__option" key={member.id} value={member.name}>
                                {member.username}
                            </option>)}
                        </Field>

                        <label htmlFor="assignee" className="dropdown__label">Priority</label>
                        <Field className="dropdown sm-btm-mrgn" as="select" name="priority">
                            <option className="dropdown__option" value={TaskPriority.Low}>{TaskPriority.Low}</option>
                            <option className="dropdown__option" value={TaskPriority.Normal}>{TaskPriority.Normal}</option>
                            <option className="dropdown__option" value={TaskPriority.High}>{TaskPriority.High}</option>
                        </Field>
                        
                        <Button type="submit" disabled={isSubmitting || errors.title || errors.description} className="button--common">Submit</Button>
                    </div>
                </Form>
            )}

        </Formik>
    )
};

export default CreateTaskForm;