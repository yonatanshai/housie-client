import React, { useState } from 'react';
import Modal from '../../shared/components/ui-elements/modal';
import HouseMembersListItem from './house-members-list-item';
import './house-members-list.css'
import '../../shared/components/ui-elements/modal.css'
import Widget from '../../shared/components/ui-elements/widget';
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

    const handleRemoveMember = (id) => {
        props.onRemoveMember(id);
    }

    const handleMakeAdmin = (id) => {
        props.onMakeMemberAdmin(id);
    }

    return (
        <Widget className="house-members-list">
            <Modal isOpen={showAddMemberForm} onRequestClose={toggleShowAddMembersForm}>
                <AddMemberForm onSubmit={handleAddMember} />
            </Modal>
            <div className="house-members-list__title">
                <IconTextLabel icon="users" text="Members" />
                <IconTextButton className="button button--inverse" icon="user-plus" text="add member" onClick={toggleShowAddMembersForm}/>
            </div>
            {members.map(member => <HouseMembersListItem
                onRemove={handleRemoveMember}
                onMakeAdmin={handleMakeAdmin}
                key={member.id}
                member={member}
                admins={admins}
                isAdmin={admins.some(a => a.id === member.id)} />)}
        </Widget>
    )
}

export default HouseMembersList;