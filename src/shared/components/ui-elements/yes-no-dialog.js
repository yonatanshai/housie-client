import React, { Fragment } from 'react';
import './yes-no-dialog.css';
import Modal from './modal';
import propTypes from 'prop-types'
import Button from '../form-elements/button';

const typeYesNo = "YesNo";
const typeYesNoCancel = "YesNoCancel";
const typesYesCancel = "YesCancel";

const Dialog = ({ show, onPositive, onNegative, onCancel, type, header, message, ...props }) => {
    return (
        <Fragment >
            <Modal isOpen={show}>
                <div className="dialog">
                    <h3 className="dialog-header">
                        {header}
                    </h3>
                    <p className="dialog-message">{message}</p>
                    <div className="dialog-buttons">
                        <Button className="dialog-button yes-button" onClick={onPositive}>Yes</Button>
                        {(type === typeYesNo || type === typeYesNoCancel) && 
                            <Button className="dialog-button no-button" onClick={onNegative}>No</Button>
                        }
                        {(type === typesYesCancel || type === typeYesNoCancel) &&
                            <Button className="dialog-button cancel-button" onClick={onCancel}>Cancel</Button>}
                    </div>
                </div>
            </Modal>
        </Fragment>
    )
};

Dialog.propTypes = {
    type: propTypes.oneOf([typeYesNo, typeYesNoCancel, typesYesCancel])
}

export default Dialog;