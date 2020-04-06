import React from 'react';
import './chat.css';
import Conversation from '../components/conversation';

const  Chat = ({...props}) => {
    return (
        <div>
            <Conversation />
        </div>
    )
};

export default Chat;