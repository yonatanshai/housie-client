import React, { useState, Fragment } from 'react';
import './settings.css';
import IconTextButton from '../../shared/components/form-elements/icon-text-button';
import ErrorModal from '../../shared/components/ui-elements/error-modal';
import Axios from 'axios';
import cc from 'currency-codes';
import Dropdown from '../../shared/components/form-elements/dropdown';

const Settings = ({ house, ...props }) => {
    const [error, setError] = useState(null);

    const handleLeaveHouse = () => {
        props.onLeaveHouse(house.id);
    }
    
    return (
        <Fragment>
            <ErrorModal
                buttonText="Ok"
                errorMessage={error}
                isOpen={error}
                onButtonClick={() => setError(null)}
                title={"Error"}
            />
            <div className="settings">
                <h1 className="settings-title">Settings</h1>
                <Dropdown onSelect={(val) => alert(val)} label="country">
                    {cc.countries().map((country, index) => <option key={index}>{country}</option>)}
                </Dropdown>
                <IconTextButton className="button button--inverse exit-button" icon="exit" text="leave house" onClick={handleLeaveHouse} />
            </div>
        </Fragment>
    )
};

export default Settings;