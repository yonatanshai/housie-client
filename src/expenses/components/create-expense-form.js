import React from 'react';
import './create-expense-form.css';
import { Formik, yupToFormErrors, Form } from 'formik';
import * as yup from 'yup';
import TextInput from '../../shared/components/form-elements/text-input';
import Button from '../../shared/components/form-elements/button';


const CreateExpenseForm = ({ house, ...props }) => {
    const handleSubmit = (values) => {
        props.onSubmit(values);
    }

    return (
        <Formik
            initialValues={{
                title: '',
                description: '',
                amount: undefined,
            }}
            validationSchema={yup.object({
                title: yup.string().required('Required'),
                description: yup.string(),
                amount: yup.number().positive('Amount must be positive').required('Required')
            })}
            onSubmit={handleSubmit}
        >
            {({ errors, values, isSubmitting }) => (
                <Form className="create-expense-form">
                    <h3 className="create-expense-form__title">Create Expense</h3>
                    <div className="create-expense-form__content">
                        <TextInput type="text" name="title" label="Title" placeholder="title" />
                        <TextInput type="text" name="description" label="Description" placeholder="description" />
                        <TextInput type="number" name="amount" label="Amount" step="0.01" placeholder="amount" />

                        <Button disabled={isSubmitting || errors.title || errors.description || errors.amount} type="submit" className="button--common">Submit</Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
};

export default CreateExpenseForm;