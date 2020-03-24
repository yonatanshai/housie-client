import React from 'react';
import { Formik, Form } from 'formik'
import * as yup from 'yup';
import Button from '../../shared/components/form-elements/button';
import TextInput from '../../shared/components/form-elements/text-input';
import './add-member-form.css';

const AddMemberForm = props => {
    const handleSubmit = (values) => {
        props.onSubmit(values);
    }

    return (
        <Formik
            onSubmit={handleSubmit}
            initialValues={{ email: '' }}
            validationSchema={yup.object({ email: yup.string().email().required() })}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form className="add-member-form" >
                    <h3 className="add-member-form__title">Add Member</h3>
                    <div className="add-member-form__body">
                        <div>
                            <TextInput type="email" name="email" placeholder="email" />
                        </div>
                        <Button disabled={isSubmitting || errors.email} className="button--common" type="submit">Add</Button>
                    </div>
                </Form>
            )}

        </Formik>
    )
};

export default AddMemberForm;