import React, { useState, useEffect } from 'react';
import HouseList from '../components/house-list';
import axios from 'axios';
import { useAuth } from '../../context/auth-context';
import Loader from '../../shared/components/ui-elements/loader';
import { Redirect } from 'react-router-dom';
import Button from '../../shared/components/form-elements/button';
import Modal from '../../shared/components/ui-elements/modal';
import AddHouseForm from '../components/add-house-form';
import './my-houses.css';
import { useAlert } from 'react-alert';
import AlertTemplate from '../../shared/components/ui-elements/alert-template';
import ErrorModal from '../../shared/components/ui-elements/error-modal';

const MyHouses = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [houses, setHouses] = useState([]);
    const [showAddHouseForm, setShowAddHouseForm] = useState(false);
    const { userData, setUserData } = useAuth();
    const alert = useAlert();

    useEffect(() => {
        const getHouses = async () => {
            setIsLoading(true);
            try {
                const res = await axios({
                    method: 'GET',
                    url: process.env.REACT_APP_API_BASE_URL + process.env.REACT_APP_HOUSES_URL,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userData.token}`
                    }
                });
                setIsLoading(false);
                setHouses(res.data);
            } catch (error) {
                console.log(error.request.status)
                if (error.request) {
                    const e = (JSON.parse(error.request.response));
                    setError({ code: e.statusCode, message: e.message });
                } else {
                    setError(error.message);
                }
            }
        }
        getHouses();
    }, [userData.token]);

    const handleAddHouse = async ({ name }) => {
        setShowAddHouseForm(false);
        try {
            const res = await axios({
                url: `${process.env.REACT_APP_API_BASE_URL}/house`,
                method: 'POST',
                data: {
                    name
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            setHouses([...houses, res.data]);
            alert.show('House Created!', { type: 'success' });
        } catch (error) {
            if (error.request) {
                const e = JSON.parse(error.request.response);
                setError({ message: e.message, code: e.statusCode });
            }
        }
    }

    const handleHouseDelete = async (houseId) => {
        try {
            await axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_BASE_URL}/house/${houseId}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                }
            });
            setHouses(houses.filter(house => house.id !== houseId));
        } catch (error) {
            if (error.request) {
                const e = JSON.parse(error.request.response);
                setError({ code: e.code, message: e.message });
            }
        }
    }

    const handleHouseClicked = (id) => {
        props.history.push(`/dashboard/${id}`);
    }

    const handleClearError = () => {
        if (error.code === 401 || error.code === 403) {
            setUserData(null);
        }
        setError(null);
    }

    if (error) {
        return (
            <ErrorModal
                isOpen={error}
                errorMessage={error.message}
                onButtonClick={handleClearError}
                title="Error"
                buttonText="Ok"
            />
        )
    }

    if (isLoading) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className="my-houses">
            <h1 className="my-houses-title">My Houses</h1>
            {houses.length > 0 && <Button className="button--inverse create-house-button" onClick={() => setShowAddHouseForm(true)}>Create House</Button>}
            <Modal
                isOpen={showAddHouseForm}
                onRequestClose={() => setShowAddHouseForm(false)}
            >
                <AddHouseForm onSubmit={handleAddHouse} />
            </Modal>
            {houses.length === 0 &&
                <div className="no-houses">
                    <p className="no-houses-message">You don't have any houses yet</p>
                    <Button className="button--link no-houses-button" onClick={() => setShowAddHouseForm(true)}>Click here to create one</Button>
                </div>
            }
            {houses.length >= 1 &&
                <div className="my-houses-content">
                    <HouseList houses={houses} onHouseClicked={handleHouseClicked} onDeleteHouse={handleHouseDelete} />
                </div>
            }
        </div>
    )
}

export default MyHouses;