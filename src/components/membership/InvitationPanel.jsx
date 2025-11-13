import { useState } from "react";
import Loading from "../global/Loading";
import Button from "../ui/Button";
import { useSession } from "../../context/session_context/useSession";
import { supabase } from "../../lib/supabaseClient";

export default function InvitationPanel() {
  const {
    session,
    setUserCommunities,
    userInvitations,
    setUserInvitations,
    UpdateUserCommunities,
  } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const HandleAcceptInviteBtnClick = async (
    inviteId,
    inviteCommunityId,
    inviteRole
  ) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("memberships")
        .insert([
          {
            user_id: session.user.id,
            community_id: inviteCommunityId,
            role: inviteRole,
          },
        ])
        .select()
        .single();

      if (error) throw new Error("Issue Accepting the invitation: ", error);

      UpdateUserCommunities();
      HandleDeclineInviteBtnClick(inviteId);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const HandleDeclineInviteBtnClick = async (inviteId) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("invitations")
        .delete()
        .eq("id", inviteId)
        .select()
        .single();
      if (!data || error)
        throw new Error("Issue Declining the invitation: ", error);
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
          <div> Invitation to {invite.communities.name}</div>
          <Button
            disabled={isLoading}
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
            disabled={isLoading}
            text="❌"
            onClick={() => HandleDeclineInviteBtnClick(invite.id)}
          />
        </div>
      ))}
    </div>
  );
}
