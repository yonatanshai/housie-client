import React from 'react';
import './archive-list-form.css';
import { Formik, Form } from 'formik';
import TextInput from '../../shared/components/form-elements/text-input';
import Button from '../../shared/components/form-elements/button';
import * as yup from 'yup';

const ArchiveListForm = ({onSubmit, onCancel, ...props }) => {
    return (
        <Formik
            initialValues={{
                amount: ''
            }}
            validationSchema={yup.object({
                amount: yup.number().min(0).required()
            })}
            onSubmit={(values) => onSubmit(values)}
        >
            {({ errors, values, isSubmitting }) => (
                <Form className="archive-form">
                    <TextInput value={values.amount} label="Amount" type="number" min="0" step={"0.01"} name="amount" placeholder="Type a number" />
                    <Button disabled={errors.amount || isSubmitting} type="form" className="button--common">Update</Button>
                    <Button type="button" className="button--normal" onClick={onCancel}>Cancel</Button>
                </Form>
            )}
        </Formik>
    )
};

export default ArchiveListForm;