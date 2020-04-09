import React, { useState } from 'react';
import './conversation.css';
import MessageForm from './message-form';
import ChatMessage from './message';
const Conversation = ({...props}) => {
    const [messages, setMessages] = useState([]);

    const handleNewMessage = ({message}) => {
        setMessages([...messages, {text: message}]);
    };

    return (
        <div className="conversation">
            <section className="messages">
                {messages.map((message, index) => <ChatMessage key={index} text={message.text}/>)}
            </section>
            <MessageForm onSubmit={handleNewMessage}/>
        </div>
    )
};

export default Conversation;