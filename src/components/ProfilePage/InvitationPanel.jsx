import Loading from '../global/Loading';
import Button from '../ui/Button';
import { useSession } from '../../context/session_context/useSession';
import useAcceptInvitation from '../../hooks/tanstack_mutations/useAcceptInvitation';
import useDeclineInvitation from '../../hooks/tanstack_mutations/useDeclineInvitation';
import { useGlobal } from '../../context/useGlobal';
import FadedText from '../ui/Text/FadedText';
import ContentText from '../ui/Text/ContentText';
import SubContentText from '../ui/Text/SubContentText';

export default function InvitationPanel() {
  const { session } = useSession();
  const { userInvitations } = useGlobal();
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

  return userInvitations.isPending ? (
    <Loading />
  ) : (
    <div
      className={`${
        userInvitations.data.length != 0 &&
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      } border-t border-b py-2 border-accent w-full gap-2`}
    >
      {userInvitations.data.length === 0 && (
        <FadedText text="No pending invites" styles="text-center" />
      )}
      {userInvitations.data.map((invite) => (
        <div
          key={invite.id}
          className="flex flex-col bg-primary border border-accent  rounded-md p-4"
        >
          <ContentText
            text={`Invite to Community: ${invite.communities.name}`}
          />
          <SubContentText text={`From ${invite.inviter_id.name}`} />
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
