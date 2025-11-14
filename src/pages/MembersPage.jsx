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
  const {
    activeCommunity,
    setCommunityMembers,
    communityInvitations,
    setCommunityInvitations,
  } = useGlobal();

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
        throw new Error(
          "Issue Kicking Member: ",
          error ? error.message : "last member"
        );

      if (memberId === session.user.id) {
        UpdateUserCommunities();
        nav("/");
        return;
      }
      setCommunityMembers((oldMembers) =>
        oldMembers.filter((member) => member.profiles.id !== memberId)
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
      setCommunityInvitations((old) => old.filter((inv) => inv.id != inviteId));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <MembershipPanel
        HandleKickMemberBtnClick={HandleKickMemberBtnClick}
        isKickLoading={isLoading}
      />
      <InviteForm />
      {activeCommunity &&
        activeCommunity.role == "admin" &&
        communityInvitations && (
          <div className="flex flex-col gap-10 justify-center items-center">
            <div className="text-3xl">Community Invitations</div>
            <div>
              {communityInvitations.map((invite) => {
                return (
                  <div
                    key={invite.id}
                    className="flex gap-4 justify-center items-center"
                  >
                    <div>{invite.profiles.email}</div>
                    <Button
                      onClick={() => HandleDeclineInviteBtnClick(invite.id)}
                      disabled={isLoading}
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
