import React, { useState } from 'react';
import Button from  '../form-elements/button';

const HoverTextButton = ({defaultText, hoverText, ...props}) => {
    const [text, setText] = useState(defaultText);

    const handleHover = () => {
        setText(hoverText);
    }

    const handleMouseOut = () => {
        setText(defaultText);
    }

    return (
        <Button onMouseOver={handleHover} onMouseOut={handleMouseOut} {...props}>
            {text}
        </Button>
    )
};

export default HoverTextButton;