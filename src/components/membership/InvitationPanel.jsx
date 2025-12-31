import { useState } from "react";
import Loading from "../global/Loading";
import Button from "../ui/Button";
import { useSession } from "../../context/session_context/useSession";
import useAcceptInvitation from "../../hooks/tanstack_mutations/useAcceptInvitation";
import useUserInvitations from "../../hooks/tanstack_queries/useUserInvitations";
import useDeclineInvitation from "../../hooks/tanstack_mutations/useDeclineInvitation";

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
          console.log("s");
        },
      }
    );
  };

  return !userInvitations ? (
    <Loading />
  ) : (
    <div>
      {userInvitations.map((invite) => (
        <div
          key={invite.id}
          className="flex flex-col gap-4 bg-white/20 border border-transparent hover:border-white rounded-md p-4"
        >
          <div> Invitation to {invite.communities.name}</div>
          <div className="flex gap-4">
            <Button
              disabled={
                DeclineInvitation.isPending || acceptInvitation.isPending
              }
              styles="w-[50%]"
              text="✔️"
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
              styles="w-[50%]"
              text="❌"
              onClick={() => HandleDeclineInviteBtnClick(invite.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
