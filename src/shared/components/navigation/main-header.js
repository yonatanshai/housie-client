import React from 'react';
import {  NavLink } from 'react-router-dom';
import './main-header.css'
import Icon from '../ui-elements/icon';
import { useAuth } from '../../../context/auth-context';

const MainHeader = props => {
    const { userData, setUserData } = useAuth();
    
    const logout = () => {
        setUserData(null);
    }

    return (
        <div className="main-header">
            {/* <div style={{width: '85px'}}>
                <img className="main-header__logo" src="/images/Group 1.jpg" alt="logo" />
            </div> */}
            <NavLink to="/" className="logo-container">
                <Icon className="logo-container__icon" name="home" />
                <span className="main-header__app-name">Housie</span>
            </NavLink>
            <div className="main-header__navigation">
                <NavLink className="main-header__link" to="/">
                    My Houses
                </NavLink>
                {userData ?
                    <NavLink to="/auth" className="button--link main-header__link" onClick={logout}>Logout</NavLink>
                    :
                    <NavLink className="main-header__link" to="/auth">
                        Login
                    </NavLink> 
                    
                }
            </div>
        </div>
    )
}

export default MainHeader;