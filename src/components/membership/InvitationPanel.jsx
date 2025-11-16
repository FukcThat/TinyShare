import { useState } from "react";
import Loading from "../global/Loading";
import Button from "../ui/Button";
import { useSession } from "../../context/session_context/useSession";
import { supabase } from "../../lib/supabaseClient";

export default function InvitationPanel() {
  const {
    session,
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
      {userInvitations.length === 0 && <div>No invites yet...</div>}
      {userInvitations.map((invite) => (
        <div
          key={invite.id}
          className="flex flex-col gap-4 bg-white/20 border border-transparent hover:border-white rounded-md p-4"
        >
          <div> Invitation to {invite.communities.name}</div>
          <div className="flex gap-4">
            <Button
              disabled={isLoading}
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
              disabled={isLoading}
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
