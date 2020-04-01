import React, { useState, useEffect } from 'react';
import HouseList from '../components/house-list';
import HouseDashBoard from './house-dashboard';
import moment from 'moment';
import { TaskPriority } from '../../shared/enums/task-priority';
import axios from 'axios';
import { useAuth } from '../../context/auth-context';
import Loader from '../../shared/components/ui-elements/loader';
import { Redirect } from 'react-router-dom';


const MyHouses = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [houses, setHouses] = useState([]);
    const { userData } = useAuth();

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
                console.log(error);
            }
        }
        getHouses();
    }, [userData.token]);


    if (isLoading) {
        return (
            <div style={{marginTop: '500px'}}><Loader /></div>
        )
    }

    else if (houses.length === 0) {
        return (
            <div>
                No houses. Click here to create one!
            </div>
        )
    } else if (houses.length === 1) {
        return (
            // <div style={{fontSize: '150px'}}>{houses[0].name}</div>
            <Redirect to={`/dashboard/${houses[0].id}`} />
            // <HouseDashBoard house={houses[0]} />
        )
    }
    return (
        <div>
            <HouseList houses={houses} />
        </div>
    )
}

export default MyHouses;