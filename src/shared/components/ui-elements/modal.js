import ReactModal from 'react-modal';
import React from 'react';

const Modal = ({
    isOpen,
    onRequestClose,
    ...props
}) => {
    const style = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            border: '1px solid #ccc',
            background: '#fff',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '6px',
            outline: 'none',
            // padding: '5rem'
        }
    }
    return (
        <ReactModal
            style={style}
            appElement={document.getElementById('root')}
            isOpen={isOpen}
            onRequestClose={onRequestClose}
        >
            {props.children}
        </ReactModal>
    )
} 

export default Modal;