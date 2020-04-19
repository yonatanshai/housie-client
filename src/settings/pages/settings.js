import React, { useState, Fragment } from 'react';
import './settings.css';
import IconTextButton from '../../shared/components/form-elements/icon-text-button';
import ErrorModal from '../../shared/components/ui-elements/error-modal';
import Axios from 'axios';
import cc, { number } from 'currency-codes';
import Dropdown from '../../shared/components/form-elements/dropdown';
import { useSettings } from '../../context/settings-context';
import { useCurrency } from '../../hooks/currency-hook';

const Settings = ({ house, ...props }) => {
    const [error, setError] = useState(null);
    const { locale, currency, onUpdateSettings } = useSettings();
    const [selectedCurrency, setSelectedCurrency] = useState(currency);
    const { generateCurrencyCodes } = useCurrency();

    const handleLeaveHouse = () => {
        props.onLeaveHouse(house.id);
    }

    const handleChangeCurrency = (curr) => {
        onUpdateSettings({currency: curr});
        setSelectedCurrency(cc.number(curr).number);
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
                <div className="settings-content">
                    <Dropdown className="currency-select" value={selectedCurrency} onSelect={handleChangeCurrency} label="Currency">
                        {generateCurrencyCodes(locale).map((code, index) =>
                            <option key={code.number} value={code.number}>
                                {`${code.currency} - ${code.formattedCurrency.value}`}
                            </option>)}
                    </Dropdown>
                    <IconTextButton className="button button--inverse exit-button" icon="exit" text="leave house" onClick={handleLeaveHouse} />
                </div>
            </div>
        </Fragment>
    )
};

export default Settings;