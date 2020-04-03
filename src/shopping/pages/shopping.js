import React, { useState, useEffect } from 'react';
import './shopping.css';
import { useAuth } from '../../context/auth-context';
import { format, startOfDay, endOfDay, subMonths } from 'date-fns';
import Axios from 'axios';
import Button from '../../shared/components/form-elements/button';
import IconTextLabel from '../../shared/components/ui-elements/icon-text-label';
import Modal from '../../shared/components/ui-elements/modal';
import CreateShoppingListForm from '../components/create-shopping-list-form';
import ShoppingListsList from '../components/shopping-lists-list';
import ShoppingList from '../components/shopping-list';

const Shopping = ({ house, ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [shoppingLists, setShoppingLists] = useState(null);
    const [fromDate, setFromDate] = useState(subMonths(new Date(), 1));
    const [toDate, setToDate] = useState(endOfDay(new Date()));
    const [activeList, setActiveList] = useState(null);
    const { userData } = useAuth();

    useEffect(() => {
        if (shoppingLists) {
            setIsLoading(false);
            setActiveList(shoppingLists[0])
        }
    }, [shoppingLists])

    useEffect(() => {

        const fetchShoppingLists = async () => {
            const from = format(startOfDay(fromDate), 'yyyy-MM-dd HH:mm:ss')
            const to = format(endOfDay(toDate), 'yyyy-MM-dd HH:mm:ss')
            let url = `${process.env.REACT_APP_API_BASE_URL}/shopping-lists?isActive=false&houseId=${house.id}&fromDate=${from}&toDate=${to}`;
            // let url = `${process.env.REACT_APP_API_BASE_URL}/shopping-lists`;
            console.log(url)
            try {
                const res = await Axios({
                    method: 'GET',
                    url,
                    headers: {
                        'content-type': 'application/json',
                        'authorization': 'Bearer ' + userData.token
                    },
                });

                console.log(res.data);
                setShoppingLists(res.data);
            } catch (error) {
                console.log(JSON.parse(error.request.response));
            }
        }
        fetchShoppingLists();
    }, [userData, house.id, fromDate, toDate]);

    const handleCreateList = async ({ name }) => {
        console.log(name)

        try {
            const res = await Axios({
                method: 'POST',
                url: `${process.env.REACT_APP_API_BASE_URL}/shopping-lists`,
                data: JSON.stringify({
                    houseId: house.id,
                    name
                }),
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                },
            });

            console.log(res.data);
        } catch (error) {
            console.log(JSON.parse(error.request.response));
        }
        toggleShowCreateForm();
    }

    const handleAddItem = async ({name, listId}) => {
        const url = `${process.env.REACT_APP_API_BASE_URL}/shopping-lists/${listId}/items`;

        try {
            const res = await Axios({
                method: 'POST',
                url,
                data: JSON.stringify({
                    name
                }),
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                },
            });
            console.log(res.data);

            setShoppingLists(prev => prev.map(list => list.id === res.data.id ? res.data : list));
        } catch (error) {
            console.log(JSON.parse(error.request.response));
        }
    }

    const handleListClicked = (listId) => {
        const list = shoppingLists.find(list => list.id === listId);
        console.log(list)
        setActiveList(list);
    }

    const toggleShowCreateForm = (e) => {
        setShowCreateForm(!showCreateForm);
    }

    if (isLoading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="shopping">
            <div className="shopping__title">
                <Modal
                    isOpen={showCreateForm}
                    onRequestClose={toggleShowCreateForm}
                >
                    <CreateShoppingListForm onSubmit={handleCreateList} />
                </Modal>
                <IconTextLabel icon="cart" text="Shopping" />
                <Button type="button" className="button--inverse" onClick={toggleShowCreateForm}>Add</Button>
            </div>
            <aside className="shopping__lists">
                {shoppingLists.map((list) => <ShoppingListsList selected={list.id === activeList.id} key={list.id} list={list} onClick={handleListClicked} />)}
            </aside>
            <div className="shopping__active-list">
                {activeList && <ShoppingList list={activeList} onAddItem={handleAddItem} />}
            </div>
        </div>
    )
};

export default Shopping;