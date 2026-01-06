import { useState } from 'react';
import useDeclineInvitation from '../../hooks/tanstack_mutations/useDeclineInvitation';
import useCommunityInvitations from '../../hooks/tanstack_queries/useCommunityInvitations';
import BgPanel from '../global/BgPanel';
import Button from '../ui/Button';
import InviteForm from './InviteForm';
import Loading from '../global/Loading';

export default function CommunityInvitePanel() {
  const DeclineInvitation = useDeclineInvitation();
  const { data: communityInvitations } = useCommunityInvitations();

  const [isEditing, setIsEditing] = useState();

  if (!communityInvitations) return <Loading />;
  return (
    <BgPanel styles="w-full">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          text={isEditing ? 'Cancel' : '+ Invite'}
          onClick={() => {
            setIsEditing(!isEditing);
          }}
          styles={`${isEditing && 'bg-warning/60 hover:bg-warning/80'}`}
          disabled={false}
        />
      </div>
      <h2 className="text-xl text-start w-full">✉️ Invites</h2>
      {isEditing ? (
        <InviteForm />
      ) : (
        <h5>Send email invitations to new members.</h5>
      )}

      <div className="flex flex-col gap-2 w-full justify-center items-center">
        <div className="text-lg text-center py-2 border-b border-b-accent w-full">
          Pending Invitations
        </div>
        {communityInvitations.length === 0 && <div>No Invitations Pending</div>}
        {communityInvitations?.map((invite) => {
          return (
            <div
              key={invite.id}
              className="flex gap-4 justify-between items-center w-full border rounded-md border-accent/40 p-2"
            >
              <div>{invite.profiles.email}</div>
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
