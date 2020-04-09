import React from 'react';
import './message.css';

const ChatMessage = ({text, ...props}) => {
    return (
        <div>
            {text}
        </div>
    )
};

export default ChatMessage;