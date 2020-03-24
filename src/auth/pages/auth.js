
import React, { Fragment, useState, useCallback } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import axios from 'axios'
import TextInput from '../../shared/components/form-elements/text-input';
import Button from '../../shared/components/form-elements/button';
import './auth.css';
import { useAuth } from '../../context/auth-context';
import { Redirect } from 'react-router-dom';


const LoginPage = (props) => {
    const [isLogin, setIsLogin] = useState(true);
    
    const { userData, setUserData } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(userData);

    const switchAuthMode = () => {
        setIsLogin(prevMode => !prevMode);
    }

    console.log({component: 'auth.js', state: {
        userData,
        isAuthenticated,
        isLogin
    }});

    
    const handleSubmit = async (values) => {
        const baseUrl = process.env.REACT_APP_API_BASE_URL;
        const url = isLogin ? baseUrl + process.env.REACT_APP_LOGIN_URL : baseUrl + process.env.REACT_APP_SIGNUP_URL;
        let data = {
            email: values.email,
            password: values.password
        }

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
            console.log(error);
        }
    }

    if (isAuthenticated) {
        return (<Redirect to='/' />)
    }

    return (
        <Formik
            initialValues={{
                email: '',
                username: '',
                password: ''
            }}
            validationSchema={yup.object({
                username: isLogin ? null : yup.string().max(14).min(2).required('Required'),
                email: yup.string().email('Invalid email address').required('Required'),
                password: yup.string().min(8, 'Password must be at least 8 characters').required('Required')
            })}
            onSubmit={handleSubmit}
        >
            {({ errors, isSubmitting }) => (
                <div className="container">
                    <Form className="auth-form">
                        {!isLogin && <TextInput label="Username" name="username" type="text" placeholder="username" />}
                        <TextInput label="Email" name="email" type="email" placeholder="email" />
                        <TextInput label="Password" name="password" type="password" placeholder="password" />
                        <div className="buttons-container">
                            <Button type="submit" disabled={isSubmitting} styleType="common">
                                {isLogin ? 'Login' : 'Create Account'}
                            </Button>
                            <Button styleType="link" type="button" to="/" onClick={switchAuthMode}>
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