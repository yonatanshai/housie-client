import React from 'react';
import './chat.css';
import Conversation from '../components/conversation';

const  Chat = ({...props}) => {
    return (
        <div className="chat-page">
            <Conversation />
        </div>
    )
};

export default Chat;