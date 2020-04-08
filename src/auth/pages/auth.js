
import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import axios from 'axios'
import TextInput from '../../shared/components/form-elements/text-input';
import Button from '../../shared/components/form-elements/button';
import './auth.css';
import { useAuth } from '../../context/auth-context';
import { Redirect } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';


const LoginPage = (props) => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);

    const { userData, setUserData } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(userData);

    const switchAuthMode = () => {
        setIsLogin(prevMode => !prevMode);
    }

    console.log(props)


    const handleSubmit = async (values, {errors}) => {
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
            try {
                const e = JSON.parse(error.request.response);
                if (e.statusCode === 401) {
                    setError('Wrong username or password');
                }
            } catch (error) {
                console.log(error);
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
                        <h2 className="auth-form__header">{isLogin ? 'Login' : 'Signup'}</h2>
                        {
                            !isLogin &&
                            <div>
                                <TextInput dataTip="This will be visible to other members of your house" label="Username" name="username" type="text" placeholder="username" />
                                <ReactTooltip type="info" delayShow={500}/>
                            </div>
                        }
                        <TextInput label="Email" name="email" type="email" placeholder="email" />
                        <TextInput label="Password" name="password" type="password" placeholder="password" />
                        {!isLogin && <TextInput label="Confirm password" name="password-retype" type="password" placeholder="confirm password" />}
                        {error && <p className="error-message">{error}</p>}
                        <div className="buttons-container">
                            <Button type="submit" disabled={isSubmitting} className="button--common">
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