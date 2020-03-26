import React, { useState, useEffect } from 'react';
import HouseList from '../components/house-list';
import HouseDashBoard from './house-dashboard';
import moment from 'moment';
import { TaskPriority } from '../../shared/enums/task-priority';
import axios from 'axios';
import { useAuth } from '../../context/auth-context';
import Loader from '../../shared/components/ui-elements/loader';
import { Redirect } from 'react-router-dom';

// const DUMMY_HOUSES = [{name: 'My First House'}, {name: 'My Second house'}]
const DUMMY_HOUSES = [
    {
        name: ['My House'],
        members: [
            {
                id: 1,
                name: 'Member 1'
            },
            {
                id: 2,
                name: 'Member 2'
            }
        ],
        admins: [
            {
                id: 1,
                name: 'Member 1'
            }
        ],
        tasks: [
            { id: 1, user: { name: 'User 1', id: 1 }, title: 'Task 1', status: 'new', priority: TaskPriority.Low, createdAt: moment().format('LL') },
            { id: 2, user: { name: 'User 2', id: 2 }, title: 'Task 2', status: 'assigned', priority: TaskPriority.Normal, createdAt: moment().format('LL') },
            { id: 3, user: { name: 'User 3', id: 3 }, title: 'Task 3', status: 'completed', priority: TaskPriority.High, createdAt: moment().format('LL') },
            { id: 4, user: { name: 'User 4', id: 4 }, title: 'Task 3', status: 'completed', priority: TaskPriority.Normal, createdAt: moment().format('LL') }
        ],
        expenses: [
            { id: 1, title: 'milk', amount: 2.45, createdAt: moment().format('LL') },
            { id: 2, title: 'toilet paper', amount: 8, createdAt: moment().format('LL') },
            { id: 3, title: 'masks', amount: 12.65, createdAt: moment().format('LL') }
        ]
    }
]

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

    console.log('my-houses.js');

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
            <HouseList houses={DUMMY_HOUSES} />
        </div>
    )
}

export default MyHouses;