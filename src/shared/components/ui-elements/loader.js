import React from 'react';
import './loader.css';
import Spinner from 'react-loader-spinner';

const Loader = (props) => {
    return (
        <div className="loader">
            <Spinner
                type="Oval"
                color="#790e8b"
                height={50}
                width={50}
                
            />
        </div>
    )
}

export default Loader;