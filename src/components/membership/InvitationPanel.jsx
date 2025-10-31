import { useState } from "react";
import Loading from "../global/Loading";
import Button from "../ui/Button";
import { communitiesApi, invitationsApi } from "../../../mocks";
import { useSession } from "../../context/session_context/useSession";

export default function InvitationPanel() {
  const { user, setUserCommunities, userInvitations, setUserInvitations } =
    useSession();
  const [isLoading, setIsLoading] = useState(false);

  const HandleAcceptInviteBtnClick = async (inviteId) => {
    try {
      setIsLoading(true);
      const res = await invitationsApi.AcceptCommunityInvite(inviteId);
      if (!res.ok) throw new Error("Issue Accepting the invitation: ", res);
      const communitRes = await communitiesApi.getUserCommunities(user.id);
      setUserCommunities(communitRes);
      setUserInvitations((old) => old.filter((inv) => inv.id != inviteId));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const HandleDeclineInviteBtnClick = async (inviteId) => {
    try {
      setIsLoading(true);
      const res = await invitationsApi.DeclineCommunityInvite(inviteId);
      if (!res.ok) throw new Error("Issue Declining the invitation: ", res);
      // if we decline then the only thing that changes for us rn is the invite state
      setUserInvitations((old) => old.filter((inv) => inv.id != inviteId));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return !userInvitations ? (
    <Loading />
  ) : (
    <div>
      {userInvitations.map((invite) => (
        <div key={invite.id}>
          <div> Invitation to {invite.communityId}</div>
          <Button
            disabled={isLoading}
            text="✔️"
            onClick={() => HandleAcceptInviteBtnClick(invite.id)}
          />
          <Button
            disabled={isLoading}
            text="❌"
            onClick={() => HandleDeclineInviteBtnClick(invite.id)}
          />
        </div>
      ))}
    </div>
  );
}
