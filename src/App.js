import React, { useState, useEffect, } from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import LoginPage from './auth/pages/auth';
import MyHouses from './house/pages/my-houses';
import './App.css';

import { AuthContext } from './context/auth-context';
import MainHeader from './shared/components/navigation/main-header';
import PrivateRoute from './routes/private-route';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import Modal from './shared/components/ui-elements/modal';
import ErrorModal from './shared/components/ui-elements/error-modal';
import Button from './shared/components/form-elements/button';

function App() {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')));
  const [showExpiredSessionModal, setShowExpiredSessionModal] = useState(false);

  const updateUserData = (data) => {
    if (!data) {
      localStorage.clear();
    } else {
      localStorage.setItem('userData', JSON.stringify(data));
    }
    setUserData(data);
  }

  useEffect(() => {
    if (userData) {

      const token = userData.token;
      try {
        const decodedToken = jwt_decode(token);
        if (moment().unix() >= decodedToken.exp) {
          toggleShowSessionExpiredModal();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [userData])

  const toggleShowSessionExpiredModal = () => {
    setShowExpiredSessionModal(prev => !prev);
  }

  const handleTokenExpired = () => {
    updateUserData(null);
    toggleShowSessionExpiredModal();
  }

  console.log('app.js');

  return (
    <div className="App">
      <AuthContext.Provider value={{ userData, setUserData: updateUserData }}>
        <BrowserRouter>
          <ErrorModal
            isOpen={showExpiredSessionModal}
            title="Session Expired"
            onButtonClick={handleTokenExpired}
            buttonText="Take Me To Login"
            errorMessage="Please login to continue"
            
          />
          <MainHeader />
        <Switch>
          <PrivateRoute exact path="/" component={MyHouses} />
          <Route exact path="/auth" component={LoginPage} />
          <Redirect to="/" />
        </Switch>
        </BrowserRouter>
      </AuthContext.Provider>
    </div >
  );
}

export default App;
