import React, { useState, useEffect } from 'react';
import './shopping.css';
import { useAuth } from '../../context/auth-context';
import { format, startOfDay, endOfDay, subMonths } from 'date-fns';
import Axios from 'axios';
import DateFilter from '../../shared/components/dashboard/date-filter';
import Button from '../../shared/components/form-elements/button';
import IconTextLabel from '../../shared/components/ui-elements/icon-text-label';
import Modal from '../../shared/components/ui-elements/modal';
import CreateShoppingListForm from '../components/create-shopping-list-form';
import ShoppingListsList from '../components/shopping-lists-list';
import ShoppingList from '../components/shopping-list';
import Checkbox from '../../shared/components/form-elements/checkbox';
import ErrorModal from '../../shared/components/ui-elements/error-modal';
import Loader from '../../shared/components/ui-elements/loader';

const Shopping = ({ house, ...props }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [shoppingLists, setShoppingLists] = useState(null);
    const [error, setError] = useState(null);
    const [fromDate, setFromDate] = useState(subMonths(new Date(), 1));
    const [toDate, setToDate] = useState(endOfDay(new Date()));
    const [filterIsActive, setFilterIsActive] = useState(true);
    const [activeList, setActiveList] = useState(null);
    const { userData, setUserData } = useAuth();

    useEffect(() => {
        if (shoppingLists) {
            setIsLoading(false);
            if (activeList) {
                const index = shoppingLists.findIndex(list => list.id === activeList.id);
                setActiveList(shoppingLists[index]);
            } else {
                setActiveList(shoppingLists[0])
            }
        }
    }, [shoppingLists, activeList])

    useEffect(() => {
        const fetchShoppingLists = async () => {
            const from = format(startOfDay(fromDate), 'yyyy-MM-dd HH:mm:ss')
            const to = format(endOfDay(toDate), 'yyyy-MM-dd HH:mm:ss')
            let url = `${process.env.REACT_APP_API_BASE_URL}/shopping-lists?isActive=${filterIsActive}&houseId=${house.id}&fromDate=${from}&toDate=${to}`;

            
            try {
                const res = await Axios({
                    method: 'GET',
                    url,
                    headers: {
                        'content-type': 'application/json',
                        'authorization': 'Bearer ' + userData.token
                    },
                });
                setShoppingLists(res.data);
                setActiveList(res.data[0]);
            } catch (error) {
                const { statusCode, message } = JSON.parse(error.request.response)
                setError({ code: statusCode, message });
            }
        }
        fetchShoppingLists();
    }, [userData, house.id, fromDate, toDate, filterIsActive]);

    const handleCreateList = async ({ name }) => {
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

            setShoppingLists([...shoppingLists, res.data]);
        } catch (error) {
            const { statusCode, message } = JSON.parse(error.request.response)
            setError({ code: statusCode, message });
        }
        toggleShowCreateForm();
    }

    const handleAddItem = async ({ name, listId }) => {
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
            const newList = shoppingLists.map(list => list.id === res.data.id ? res.data : list);
            setShoppingLists(newList);
        } catch (error) {
            const { statusCode, message } = JSON.parse(error.request.response)
            setError({ code: statusCode, message });
        }
    }

    const handleListClicked = (listId) => {
        const list = shoppingLists.find(list => list.id === listId);
        setActiveList(list);
    }

    const updateItem = async ({ listId, itemId, ...values }) => {
        setIsLoading(true);
        const url = `${process.env.REACT_APP_API_BASE_URL}/shopping-lists/${listId}/items/${itemId}`;
        try {
            const res = await Axios({
                method: 'PATCH',
                url,
                data: JSON.stringify({
                    name: values.name,
                    checked: values.checked
                }),
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                },
            });
            const list = shoppingLists.find(li => li.id === listId);
            const newItems = list.items.map(item => item.id === itemId ? res.data : item);

            setShoppingLists(shoppingLists.map(li => {
                if (li.id === listId) {
                    li.items = sortCheckedLast(newItems);
                }
                return li;
            }));
            setIsLoading(false);
            
        } catch (error) {
            const { statusCode, message } = JSON.parse(error.request.response)
            setError({ code: statusCode, message });
            setIsLoading(false);
        }
    }

    const handleDeleteItem = async ({ listId, itemId }) => {
        
        try {
            const res = await Axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_BASE_URL}/shopping-lists/${listId}/items/${itemId}`,
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                },
            });
            setShoppingLists(prev => prev.map(list => list.id === listId ? res.data : list));
        } catch (error) {
            const { statusCode, message } = JSON.parse(error.request.response)
            setError({ code: statusCode, message });
        }
    }

    const handleDeleteList = async (listId) => {
        try {
            await Axios({
                method: 'DELETE',
                url: `${process.env.REACT_APP_API_BASE_URL}/shopping-lists/${listId}`,
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                },
            });
            setShoppingLists(shoppingLists.filter(list => list.id !== listId));
        } catch (error) {
            const { statusCode, message } = JSON.parse(error.request.response)
            setError({ code: statusCode, message });
        }
    }

    const handleUpdateList = async ({ listId, isActive, name, updateExpenses, amount }) => {
        setIsLoading(true);
        try {
            const res = await Axios({
                method: 'PATCH',
                url: `${process.env.REACT_APP_API_BASE_URL}/shopping-lists/${listId}`,
                data: JSON.stringify({
                    isActive,
                    name,
                    updateExpenses: updateExpenses ? updateExpenses : false,
                    totalAmount: amount
                }),
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer ' + userData.token
                },
            });
            // if the update included deactivation of the list, then remove it from the ui
            const newList = res.data.isActive ?
                shoppingLists.map(list => list.id === listId ? res.data : list) :
                shoppingLists.filter(list => list.id !== listId);

            setShoppingLists(newList);
            if (updateExpenses) {
                props.onAlertChange({
                    message: 'Shopping list added to expenses',
                    type: 'success'
                })
            } else if (!isActive) {
                props.onAlertChange({
                    message: 'List archived',
                    type: 'success'
                })
            }
            setIsLoading(false);
        } catch (error) {
            const { statusCode, message } = JSON.parse(error.request.response)
            setError({ code: statusCode, message });
            setIsLoading(false);
        }
    }

    const sortCheckedLast = (items) => {
        const sortedItems = items.sort((a, b) => {
            if (a.checked && !b.checked) {
                return 1;
            }

            if (!a.checked && b.checked) {
                return -1;
            }
            return 0;
        });

        return sortedItems;
    }

    const toggleShowCreateForm = (e) => {
        setShowCreateForm(!showCreateForm);
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
                {house.admins.some(a => a.id === userData.user.id) && <Button type="button" className="button--inverse" onClick={toggleShowCreateForm}>Add</Button>}

            </div>
            <div className="shopping-filters">
                <h3 className="shopping-filters__title">Filter lists</h3>
                <DateFilter
                    className="shopping-filters__date"
                    onFromDateChange={(date) => setFromDate(date)}
                    onToDateChange={(date) => setToDate(date)}
                    fromDate={fromDate}
                    toDate={toDate}
                />
                <Checkbox
                    className="shopping-filters__checkbox"
                    label="Archived"
                    checked={!filterIsActive}
                    onChange={() => setFilterIsActive(!filterIsActive)}
                />
            </div>

            {isLoading ? <Loader /> : activeList &&
                <ul className="shopping__lists">
                    {shoppingLists.map((list) => <ShoppingListsList
                        onDelete={handleDeleteList}
                        selected={list.id === activeList.id}
                        key={list.id}
                        list={list}
                        onClick={handleListClicked} />)}

                </ul>
            }
            <div className="shopping__active-list">
                {isLoading ? <Loader /> : activeList && <ShoppingList
                    list={activeList}
                    admins={house.admins}
                    onAddItem={handleAddItem}
                    onUpdateItem={updateItem}
                    onDeleteItem={handleDeleteItem}
                    onUpdate={handleUpdateList}
                />}
            </div>
        </div>
    )
};

export default Shopping;