import React from 'react';
import { NavLink } from 'react-router-dom';
import './main-header.css'
import Icon from '../ui-elements/icon';
import { useAuth } from '../../../context/auth-context';
import IconTextLabel from '../ui-elements/icon-text-label';

const MainHeader = props => {
    const { userData, setUserData } = useAuth();

    const logout = () => {
        setUserData(null);
    }

    return (
        <div className="main-header">
            <NavLink to="/" className="logo-container">
                <Icon className="logo-container__icon" name="home" />
                <span className="main-header__app-name">Housie</span>
            </NavLink>

            <div className="main-header__navigation">
                {userData && <span className="main-header__username">Hello {userData.user && userData.user.username}</span>}
                <NavLink className="main-header__link my-houses-link" to="/">
                    My Houses
                </NavLink>
                {userData ?
                    <NavLink to="/auth" className="button--link main-header__link" onClick={logout}><IconTextLabel textFirst icon="exit" text="Logout"/></NavLink>
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