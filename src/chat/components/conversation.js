import React from 'react';
import './conversation.css';
import MessageForm from './message-form';

const Conversation = ({...props}) => {
    const handleNewMessage = ({message}) => {
        console.log(message)
    };

    return (
        <div>
            <p>
                lorem sdadkjl23 ds lkw1je  lkj dsalk jsd
            </p>
            <MessageForm onSubmit={handleNewMessage}/>
        </div>
    )
};

export default Conversation;