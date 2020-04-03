import React from 'react';
import './create-shopping-list-form.css';
import { Formik, Form } from 'formik';
import TextInput from '../../shared/components/form-elements/text-input';
import * as yup from 'yup'
import Button from '../../shared/components/form-elements/button';
const CreateShoppingListForm = ({ ...props }) => {
    return (
        <Formik
            initialValues={{
                name: ''
            }}
            validationSchema={yup.object({
                name: yup.string().min('2').required('Required')
            })}
            onSubmit={(values) => props.onSubmit(values)}
        >
            {({ errors, isSubmitting }) => (
                <Form className="form">
                    <h3 className="form__title">Create List</h3>
                    <div className="form__content">
                        <TextInput type="text" name="name" label="Name" placeholder="My list" />
                        <Button disabled={errors.name || isSubmitting} className="button--common" type="submit">submit</Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
};

export default CreateShoppingListForm;