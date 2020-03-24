import React, { useState } from 'react';
import Modal from '../../shared/components/ui-elements/modal';
import HouseMembersListItem from './house-members-list-item';
import Button from '../../shared/components/form-elements/button';
import './house-members-list.css'
import '../../shared/components/ui-elements/modal.css'
import { Formik, Form } from 'formik';
import TextInput from '../../shared/components/form-elements/text-input';
import * as yup from 'yup';
import Widget from '../../shared/components/ui-elements/widget';
import Icon from '../../shared/components/ui-elements/icon';
import IconTextButton from '../../shared/components/form-elements/icon-text-button';
import IconTextLabel from '../../shared/components/ui-elements/icon-text-label';
import AddMemberForm from './add-member-form';

const HouseMembersList = ({ house, members, admins, ...props }) => {
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    
    const toggleShowAddMembersForm = () => {
        setShowAddMemberForm(!showAddMemberForm);
    }

    const handleAddMember = (values) => {
        toggleShowAddMembersForm();
        props.onAddMember({values, houseId: house.id});
    }

    return (
        <Widget className="house-members-list">
            <Modal isOpen={showAddMemberForm} onRequestClose={toggleShowAddMembersForm}>
                <AddMemberForm onSubmit={handleAddMember} />
            </Modal>
            <div className="house-members-list__title">
                <IconTextLabel icon="man-woman" text="Members" />
                <IconTextButton className="button button--inverse" icon="user-plus" text="add member" onClick={toggleShowAddMembersForm}/>
            </div>
            {members.map(member => <HouseMembersListItem key={member.id} member={member} isAdmin={admins.some(a => a.id === member.id)} />)}
        </Widget>
    )
}

export default HouseMembersList;