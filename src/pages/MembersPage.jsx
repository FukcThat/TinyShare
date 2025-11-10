import { useNavigate } from "react-router";
import MembershipPanel from "../components/membership/MembershipPanel";
import Button from "../components/ui/Button";
import { useGlobal } from "../context/useGlobal";
import { useEffect, useState } from "react";
import { useSession } from "../context/session_context/useSession";
import { supabase } from "../lib/supabaseClient";
import InviteForm from "../components/membership/InviteForm";

export default function MembersPage() {
  const { session, UpdateUserCommunities } = useSession();
  const { activeCommunity, setCommunityMembers, invitations, setInvitations } =
    useGlobal();

  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    if (!activeCommunity) return;
    if (activeCommunity.id === -1) nav("/");
  }, [activeCommunity]);

  const HandleKickMemberBtnClick = async (memberId) => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("memberships")
        .delete()
        .eq("user_id", memberId)
        .eq("community_id", activeCommunity.id)
        .select();

      if (error || data.length === 0)
        throw new Error("Issue Kicking Member: ", error.message);

      if (memberId === session.user.id) {
        UpdateUserCommunities();
        nav("/");
        return;
      }
      setCommunityMembers((oldMembers) =>
        oldMembers.filter((member) => member.id !== memberId)
      );
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
      setInvitations((old) => old.filter((inv) => inv.id != inviteId));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <InviteForm />
      {activeCommunity && activeCommunity.role == "admin" && invitations && (
        <div>
          <div>Community Invitations</div>
          <div>
            {invitations.map((invite) => {
              return (
                <div key={invite.id}>
                  <div>{invite.profiles.email}</div>
                  <button
                    onClick={() => HandleDeclineInviteBtnClick(invite.id)}
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <MembershipPanel
        HandleKickMemberBtnClick={HandleKickMemberBtnClick}
        isKickLoading={isLoading}
      />
      <div>
        <Button
          text="🚶‍♀️‍➡️"
          onClick={() => HandleKickMemberBtnClick(session.user.id)}
        />
      </div>
    </div>
  );
}
