import React, { useState } from 'react';
import ContentText from '../ui/Text/ContentText';
import SubContentText from '../ui/Text/SubContentText';
import useAcceptInvitation from '../../hooks/tanstack_mutations/useAcceptInvitation';
import { useSession } from '../../context/session_context/useSession';
import useDeclineInvitation from '../../hooks/tanstack_mutations/useDeclineInvitation';
import Button from '../ui/Button';
import ErrorText from '../ui/Text/ErrorText';

export default function UserInvitationPanel({ invite }) {
  const { session } = useSession();
  const acceptInvitation = useAcceptInvitation();
  const DeclineInvitation = useDeclineInvitation();
  const [err, setErr] = useState(null);

  const HandleAcceptInviteBtnClick = (
    inviteId,
    inviteCommunityId,
    inviteRole,
  ) => {
    acceptInvitation.mutate(
      {
        user_id: session.user.id,
        community_id: inviteCommunityId,
        role: inviteRole,
      },
      {
        onSuccess: () => {
          HandleDeclineInviteBtnClick(inviteId);
          setErr(null);
        },
        onError: (error) => setErr(error.message),
      },
    );
  };

  const HandleDeclineInviteBtnClick = async (inviteId) => {
    DeclineInvitation.mutate(
      { inviteId },
      {
        onSuccess: () => {
          setErr(null);
        },
        onError: (error) => setErr(error.message),
      },
    );
  };
  return (
    <div className="flex flex-col bg-primary border border-accent  rounded-md p-4 w-full">
      <ContentText text={`Community Invitation: ${invite.communities.name}`} />
      <SubContentText text={`From ${invite.inviter_id.name}`} />
      <div className="flex gap-4 my-2">
        <Button
          disabled={DeclineInvitation.isPending || acceptInvitation.isPending}
          styles="w-[50%] bg-accent/80 hover:bg-accent/60"
          text="✔️ Accept"
          onClick={() =>
            HandleAcceptInviteBtnClick(
              invite.id,
              invite.community_id,
              invite.role,
            )
          }
        />
        <Button
          disabled={DeclineInvitation.isPending || acceptInvitation.isPending}
          styles="w-[50%] bg-warning/60 hover:bg-warning/80"
          text="❌ Decline"
          onClick={() => HandleDeclineInviteBtnClick(invite.id)}
        />
      </div>
      {err && <ErrorText text={err} styles="my-4" />}
    </div>
  );
}
