import React, { Fragment } from 'react';
import './task-filter-form.css';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import TextInput from '../../shared/components/form-elements/text-input';
import Dropdown from '../../shared/components/form-elements/dropdown';
import Button from '../../shared/components/form-elements/button';
const TaskFilterForm = (props) => {

    const submitForm = (values) => {
        props.onFilter(values);
    }

    return (
        <Formik
            initialValues={{
                title: '',
                status: 'active',
                sortBy: 'date'
            }}
            validationSchema={yup.object({
                title: yup.string(),
                status: yup.string().oneOf(['active', 'completed']),
                sortBy: yup.string().oneOf(['date', 'title'])
            })}
            onSubmit={submitForm}
        >
            {({errors, isSubmitting, values}) => (
                <Form className="task-filter-form">
                    <TextInput type="text" name="title" placeholder="Title" />
                    <Field className="dropdown" as="select" name="status">
                        <option className="dropdown__option" value="active">Open</option>
                        <option className="dropdown__option" value="completed">Completed</option>
                    </Field>
                    <Field className="dropdown" as="select" name="sortBy">
                        <option className="dropdown__option" value="date">Date</option>
                        <option className="dropdown__option" value="title">Title</option>
                    </Field>
                    <Button type="submit" disabled={errors.title || errors.status || errors.sortBy} className="button--success">Filter</Button>
                </Form>
            )}
        </Formik>
    )
};

export default TaskFilterForm;