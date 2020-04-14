import React, { useState, useEffect, } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import LoginPage from './auth/pages/auth';
import MyHouses from './house/pages/my-houses';
import './App.css';

import { AuthContext } from './context/auth-context';
import MainHeader from './shared/components/navigation/main-header';
import PrivateRoute from './routes/private-route';
import jwt_decode from 'jwt-decode';
import moment from 'moment';
import ErrorModal from './shared/components/ui-elements/error-modal';
import HouseDashBoard from './house/pages/house-dashboard';
import { Provider as AlertProvider, positions, transitions } from 'react-alert';
// import AlertTemplate from "react-alert-template-basic";
import AlertTemplate from './shared/components/ui-elements/alert-template';
import { SettingsContext } from './context/settings-context';
import cc from 'currency-codes';

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

  const alertOptions = {
    position: positions.BOTTOM_CENTER,
    timeout: 3000,
    transition: transitions.SCALE,
  }

  

  return (
    <div className="App">
      <AlertProvider
        template={AlertTemplate}
        {...alertOptions}
      >
        <AuthContext.Provider value={{ userData, setUserData: updateUserData }}>
          <SettingsContext.Provider value={{locale: 'he-IL', currency: cc.country('israel')[0].code}}>
            <BrowserRouter>
              {/* <ErrorModal
              isOpen={showExpiredSessionModal}
              title="Session Expired"
              onButtonClick={handleTokenExpired}
              buttonText="Ok"
              errorMessage="Please login to continue"

            /> */}
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                <MainHeader />
                <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                  <Switch>
                    <PrivateRoute exact path="/" component={MyHouses} />
                    <Route exact path="/auth" component={LoginPage} />
                    {/* <Redirect to="/" /> */}
                  </Switch>
                  <PrivateRoute path="/dashboard/:houseId" component={HouseDashBoard} />
                </div>
              </div>
            </BrowserRouter>
          </SettingsContext.Provider>
        </AuthContext.Provider>
      </AlertProvider>
    </div >
  );
}

export default App;
