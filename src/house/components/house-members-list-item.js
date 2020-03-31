import React from 'react';
import './house-members-list-item.css'
import Button from '../../shared/components/form-elements/button';
import Icon from '../../shared/components/ui-elements/icon';
import DeleteButton from '../../shared/components/ui-elements/delete-button';
import IconTextLabel from '../../shared/components/ui-elements/icon-text-label';
const HouseMembersListItem = ({ member, isAdmin, ...props }) => {

    const handleRemoveMember = () => {
        props.onRemove(member.id);
    }

    return (
        <div className="house-members-list-item">
            <IconTextLabel textFirst icon={`${isAdmin && 'user-tie'}`} text={member.username} />
            <div className="member-actions">
                <Button className={`member-actions__action button--inverse-modify`} disabled={isAdmin} onClick={() => alert('clicked')}>
                    Make Admin
                </Button>
                <DeleteButton onClick={handleRemoveMember}/>
            </div>
        </div>
    )
}

export default HouseMembersListItem;