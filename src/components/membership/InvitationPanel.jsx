import Loading from '../global/Loading';
import Button from '../ui/Button';
import { useSession } from '../../context/session_context/useSession';
import useAcceptInvitation from '../../hooks/tanstack_mutations/useAcceptInvitation';
import useUserInvitations from '../../hooks/tanstack_queries/useUserInvitations';
import useDeclineInvitation from '../../hooks/tanstack_mutations/useDeclineInvitation';

export default function InvitationPanel() {
  const { session } = useSession();
  const { data: userInvitations } = useUserInvitations();
  const acceptInvitation = useAcceptInvitation();
  const DeclineInvitation = useDeclineInvitation();

  const HandleAcceptInviteBtnClick = (
    inviteId,
    inviteCommunityId,
    inviteRole
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
        },
      }
    );
  };

  const HandleDeclineInviteBtnClick = async (inviteId) => {
    DeclineInvitation.mutate(
      { inviteId },
      {
        onSuccess: () => {
          console.log('s');
        },
      }
    );
  };

  return !userInvitations ? (
    <Loading />
  ) : (
    <div
      className={`${
        userInvitations.length != 0 &&
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      } border-t border-b py-2 border-accent w-full gap-2`}
    >
      {userInvitations.length === 0 && (
        <div className="w-full text-center text-sm text-text-primary/80">
          No pending invites
        </div>
      )}
      {userInvitations.map((invite) => (
        <div
          key={invite.id}
          className="flex flex-col bg-primary border border-accent  rounded-md p-4"
        >
          <div className="text-lg">
            {' '}
            Invite to Community: {invite.communities.name}
          </div>
          <div> From {invite.inviter_id.name}</div>
          <div className="flex gap-4 my-2">
            <Button
              disabled={
                DeclineInvitation.isPending || acceptInvitation.isPending
              }
              styles="w-[50%] bg-accent/80 hover:bg-accent/60"
              text="✔️ Accept"
              onClick={() =>
                HandleAcceptInviteBtnClick(
                  invite.id,
                  invite.community_id,
                  invite.role
                )
              }
            />
            <Button
              disabled={
                DeclineInvitation.isPending || acceptInvitation.isPending
              }
              styles="w-[50%] bg-warning/60 hover:bg-warning/80"
              text="❌ Decline"
              onClick={() => HandleDeclineInviteBtnClick(invite.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
