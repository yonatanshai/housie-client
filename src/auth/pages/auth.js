
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import axios from 'axios'
import TextInput from '../../shared/components/form-elements/text-input';
import Button from '../../shared/components/form-elements/button';
import './auth.css';
import { useAuth } from '../../context/auth-context';
import { Redirect } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { useCurrency } from '../../hooks/currency-hook';
import { country, code, number } from 'currency-codes';
import Loader from '../../shared/components/ui-elements/loader';


const LoginPage = (props) => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);

    const { userData, setUserData } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(userData);
    const { generateCurrencyCodes } = useCurrency();

    const switchAuthMode = () => {
        setIsLogin(prevMode => !prevMode);
    }

    const handleSubmit = async (values, { errors, resetForm }) => {
        const url = isLogin ? `${process.env.REACT_APP_API_BASE_URL}/auth/signin` : `${process.env.REACT_APP_API_BASE_URL}/auth/signup`;
        let data = {
            email: values.email,
            password: values.password,
            currency: values.currency
        }

        resetForm();
        if (!isLogin) {
            data = {
                username: values.username,
                ...data,
            }
        }

        try {
            const res = await axios.post(url, JSON.stringify(data),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            setUserData(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            const e = JSON.parse(error.request.response);
            if (e.statusCode === 401) {
                setError('Wrong username or password');
            }

            if (e.statusCode === 409) {
                setError('There is already a user with this email')
            }
        }
    }

    if (isAuthenticated) {
        try {
            if (props.location.state.referer) {
                return <Redirect to={props.location.state.referer} />
            }
        } catch (error) {
            return <Redirect to='/' />
        }
        return (<Redirect to='/' />)
    }

    return (
        <Formik
            initialValues={{
                email: '',
                username: '',
                confirmPassword: '',
                password: '',
                currency: 840
            }}
            validationSchema={yup.object({
                username: isLogin ? null : yup.string().max(14).min(2).required('Required'),
                email: yup.string().email('Invalid email address').required('Required'),
                password: yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
                currency: yup.number().required('Required'),
                confirmPassword: !isLogin && yup.string().when('password', {
                    is: val => val && val.length > 0 ? true : false,
                    then: yup.string().oneOf(
                        [yup.ref('password')],
                        'passwords need to match'
                    ).required('Required')
                })
            })}
            onSubmit={handleSubmit}
        >
            {({ errors, isSubmitting, values }) => (
                <div className="container">
                    <Form className="auth-form">
                        <h2 className="auth-form__header">{isLogin ? 'Login' : 'Signup'}</h2>
                        {
                            !isLogin &&
                            <div>
                                <TextInput dataTip="This will be visible to other members of your house" value={values.username} label="Username" name="username" type="text" placeholder="username" />
                                <ReactTooltip type="info" delayShow={500} />
                            </div>
                        }
                        <TextInput value={values.email} label="Email" name="email" type="email" placeholder="email" />
                        <TextInput value={values.password} label="Password" name="password" type="password" placeholder="password" />
                        {!isLogin && <TextInput value={values.confirmPassword} label="Confirm password" name="confirmPassword" type="password" placeholder="confirm password" />}
                        {!isLogin &&
                            <div className="select-container">
                                <label className="select-label" htmlFor="currency">Currency</label>
                                <Field className="select-dropdown" label="currency" as="select" value={values.currency} name="currency">
                                    {generateCurrencyCodes().map(c => <option key={c.number} value={c.number}>
                                        {c.currency} - {c.formattedCurrency.value}
                                    </option>)}
                                </Field>
                            </div>}
                        {error && <p className="error-message">{error}</p>}
                        <div className="buttons-container">
                            {isSubmitting && <Loader />}
                            <Button type="submit" disabled={isSubmitting || errors.username || errors.password || errors.email || errors.confirmPassword} className="button--common">
                                {isLogin ? 'Login' : 'Create Account'}
                            </Button>
                            <Button className="button--link" type="button" to="/" onClick={switchAuthMode}>
                                {isLogin ? 'Or create account' : 'Already have an account'}
                            </Button>
                        </div>
                    </Form>
                </div>
            )}

        </Formik>
    )
}

export default LoginPage;