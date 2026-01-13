import { useState } from 'react';
import useDeclineInvitation from '../../hooks/tanstack_mutations/useDeclineInvitation';
import BgPanel from '../global/BgPanel';
import Button from '../ui/Button';
import InviteForm from './InviteForm';
import Loading from '../global/Loading';
import SubHeaderText from '../ui/Text/SubHeaderText';
import SubContentText from '../ui/Text/SubContentText';
import ContentText from '../ui/Text/ContentText';
import { CancelIcon, NewInviteIcon, SendInviteIcon } from '../ui/Icons/Icons';
import { useGlobal } from '../../context/useGlobal';

export default function CommunityInvitePanel() {
  const DeclineInvitation = useDeclineInvitation();
  const { communityInvitations } = useGlobal();
  const [isEditing, setIsEditing] = useState();

  return (
    <BgPanel styles="w-full">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          text={isEditing ? 'Cancel' : ''}
          iconPos={isEditing ? 'left' : 'center'}
          icon={isEditing ? <CancelIcon /> : <NewInviteIcon styles={'w-6'} />}
          onClick={() => {
            setIsEditing(!isEditing);
          }}
          styles={`${isEditing && 'bg-warning/60 hover:bg-warning/80'}`}
          disabled={communityInvitations.isPending}
        />
      </div>
      <div className="flex w-full gap-2">
        <SendInviteIcon styles={'w-6'} />
        <SubHeaderText text={'Invites'} />
      </div>
      {isEditing ? (
        <InviteForm />
      ) : (
        <SubContentText
          text="Send email invitations to new members."
          styles="text-center"
        />
      )}

      <div className="flex flex-col gap-2 w-full justify-center items-center">
        <ContentText
          text="Pending Invitations"
          styles="text-center py-2 border-b border-b-accent"
        />
        {communityInvitations.isPending ? (
          <Loading />
        ) : (
          communityInvitations.data.length === 0 && (
            <SubContentText text="No Pending Invites" styles="text-center" />
          )
        )}
        {!communityInvitations.isPending &&
          communityInvitations.data.map((invite) => {
            return (
              <div
                key={invite.id}
                className="flex gap-4 justify-between items-center w-full border rounded-md border-accent/40 p-2"
              >
                <ContentText text={invite.profiles.email} />
                <Button
                  onClick={() =>
                    DeclineInvitation.mutate({ inviteId: invite.id })
                  }
                  styles="bg-warning/60 hover:bg-warning/80"
                  disabled={DeclineInvitation.isPending}
                  text="🗑️"
                />
              </div>
            );
          })}
      </div>
    </BgPanel>
  );
}
