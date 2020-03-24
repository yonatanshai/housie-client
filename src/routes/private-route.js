import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

function PrivateRoute({ component: Component, ...rest }) {
    const { userData } = useAuth();
    console.log('PrivateRoute');
    return (
        <Route {...rest} render={(props) => userData ? (
            <Component {...props} />
        ) : <Redirect to={{pathname: '/auth', state: {referer: props.location}}} />}
        />
    );
}


export default PrivateRoute;