import { useNavigate } from "react-router";
import MembershipPanel from "../components/membership/MembershipPanel";
import Button from "../components/ui/Button";
import { useGlobal } from "../context/useGlobal";
import { useEffect } from "react";
import { useSession } from "../context/session_context/useSession";
import InviteForm from "../components/membership/InviteForm";
import useKickMember from "../hooks/tanstack_mutations/useKickMember";
import useCommunityInvitations from "../hooks/tanstack_queries/useCommunityInvitations";
import useDeclineInvitation from "../hooks/tanstack_mutations/useDeclineInvitation";

export default function MembersPage() {
  const { session } = useSession();
  const { activeCommunity } = useGlobal();
  const { data: communityInvitations } = useCommunityInvitations();
  const kickMember = useKickMember();
  const DeclineInvitation = useDeclineInvitation();
  const nav = useNavigate();

  useEffect(() => {
    if (!activeCommunity) return;
    if (activeCommunity.id === -1) nav("/");
  }, [activeCommunity]);

  const HandleKickMemberBtnClick = (memberId) => {
    kickMember.mutate({
      memberId,
      activeCommunity,
    });
  };

  const HandleDeclineInviteBtnClick = async (inviteId) => {
    DeclineInvitation.mutate({ inviteId });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <MembershipPanel
        HandleKickMemberBtnClick={HandleKickMemberBtnClick}
        isKickLoading={kickMember.isPending}
      />
      <InviteForm />
      {activeCommunity && activeCommunity.role == "admin" && (
        <div className="flex flex-col gap-10 justify-center items-center">
          <div className="text-3xl">Community Invitations</div>
          <div>
            {communityInvitations?.map((invite) => {
              return (
                <div
                  key={invite.id}
                  className="flex gap-4 justify-center items-center"
                >
                  <div>{invite.profiles.email}</div>
                  <Button
                    onClick={() => HandleDeclineInviteBtnClick(invite.id)}
                    disabled={DeclineInvitation.isPending}
                    text="🗑️"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <Button
          text="Leave Community🚶‍♀️‍➡️"
          onClick={() => HandleKickMemberBtnClick(session.user.id)}
        />
      </div>
    </div>
  );
}
