import React from 'react';
import './message-form.css';
import TextInput from '../../shared/components/form-elements/text-input';
import { Formik, Form } from 'formik';
import Button from '../../shared/components/form-elements/button';
import Icon from '../../shared/components/ui-elements/icon';
import * as yup from 'yup';

const MessageForm = ({ onSubmit, ...props }) => {
    return (
        <Formik
            initialValues={{
                message: ''
            }}
            validationSchema={yup.object({
                message: yup.string().required()
            })}
            onSubmit={(values, { resetForm }) => {
                onSubmit(values);
                resetForm();
            }}
        >
            {({ values, errors, isSubmitting }) => (
                <Form className="message-form">
                    <TextInput value={values.message} hideError={true} orientation="horizontal" type="text" name="message" placeholder="Type here" />
                    <Button disabled={errors.message || isSubmitting} type="submit" className="button--icon send-button">
                        <Icon name="send" />
                    </Button>
                </Form>
            )}
        </Formik>
    )
};

export default MessageForm;
