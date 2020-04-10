import React from 'react';
import './house-members-list-item.css'
import Button from '../../shared/components/form-elements/button';
import DeleteButton from '../../shared/components/ui-elements/delete-button';
import IconTextLabel from '../../shared/components/ui-elements/icon-text-label';
import { useAuth } from '../../context/auth-context';
const HouseMembersListItem = ({ member, isAdmin, ...props }) => {
    const {userData} = useAuth();
    const handleRemoveMember = () => {
        props.onRemove(member.id);
    }

    const handleMakeAdmin = () => {
        props.onMakeAdmin(member.id);
    }

    console.log({id: member.id, userId: userData.user.id});
    return (
        <div className="house-members-list-item">
            <IconTextLabel textFirst icon={`${isAdmin && 'user-tie'}`} text={member.username} />
            {props.admins.some(a => a.id === userData.user.id) && member.id !== userData.user.id &&
                <div className="member-actions">
                    <Button className={`member-actions__action button--inverse-modify`} disabled={isAdmin} onClick={handleMakeAdmin}>
                        Make Admin
                    </Button>
                    <DeleteButton onClick={handleRemoveMember} />
                </div>
            }
        </div>
    )
}

export default HouseMembersListItem;