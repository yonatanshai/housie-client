import React from 'react';
import Modal from './modal';
import './error-modal.css';
import Button from '../form-elements/button';

const ErrorModal = ({ isOpen, onRequestClose, title, errorMessage, onButtonClick, buttonText, ...props }) => {

    return (
        <Modal isOpen={!!isOpen}>
            <div className="error-modal">
                <h3 className="error-modal__title">{title}</h3>
                <div className="error-modal__content">
                    <p className="error-modal__text">{errorMessage}</p>
                    <Button className="button--common" onClick={onButtonClick}>{buttonText}</Button>
                </div>
            </div>
        </Modal>
    )
};

export default ErrorModal;