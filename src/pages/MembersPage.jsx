import { useNavigate } from "react-router";
import MembershipPanel from "../components/membership/MembershipPanel";
import Button from "../components/ui/Button";
import { useGlobal } from "../context/useGlobal";
import { useEffect, useState } from "react";
import { useSession } from "../context/session_context/useSession";
import { supabase } from "../lib/supabaseClient";

export default function MembersPage() {
  const { session, UpdateUserCommunities } = useSession();
  const { activeCommunity, setCommunityMembers } = useGlobal();

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

  return (
    <div>
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
