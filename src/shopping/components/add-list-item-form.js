import React from 'react';
import './add-list-item-form.css';
import Icon from '../../shared/components/ui-elements/icon';
import Button from '../../shared/components/form-elements/button';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import TextInput from '../../shared/components/form-elements/text-input';

const AddListItemForm = ({ ...props }) => {
    const handleSubmit = (values, {resetForm}) => {
        resetForm();
        props.onSubmit(values);
    }

    return (
        <Formik
            initialValues={{
                name: ''
            }}
            validationSchema={yup.object({
                name: yup.string().required('Required')
            })}
            onSubmit={handleSubmit}
        >
            {({ errors, isSubmitting, values }) => (
                <Form className="add-item-form" >
                    <TextInput value={values.name} hideError={true} orientation="horizontal" type="text" name="name" placeholder="Item name" />
                    <Button disabled={errors.name} type="submit" className="button--icon add-item-button">
                        <Icon name="plus" />
                    </Button>
                </Form>
            )}
        </Formik>

    )
};

export default AddListItemForm;