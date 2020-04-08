import React from 'react';
import './add-member-form.css';
import { Formik, Form } from 'formik';
import TextInput from '../../shared/components/form-elements/text-input';
import Button from '../../shared/components/form-elements/button'
import * as yup from 'yup';

const AddHouseForm = ({ onSubmit, ...props }) => {
    return (
        <Formik
            initialValues={{
                name: ''
            }}
            validationSchema={yup.object({
                name: yup.string().min(2).max(40).required()
            })}
            onSubmit={onSubmit}
        >
            {({ values, errors, isSubmitting }) => (
                <Form>
                    <h3 className="form-title">Create House</h3>
                    <section className="form-body">
                        <TextInput type="text" autoComplete="off" name="name" placeholder="My house" value={values.name} />
                        <Button type="submit" className="button--common" disabled={errors.name || isSubmitting}>Submit</Button>
                    </section>
                </Form>
            )}
        </Formik>
    )
};

export default AddHouseForm;