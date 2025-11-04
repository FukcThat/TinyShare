import { useNavigate } from "react-router";
import MembershipPanel from "../components/membership/MembershipPanel";
import Button from "../components/ui/Button";
import { useGlobal } from "../context/useGlobal";
import { useEffect, useState } from "react";
import { useSession } from "../context/session_context/useSession";
import { communitiesApi, membershipsApi } from "../../mocks";

export default function MembersPage() {
  const { session, setUserCommunities } = useSession();
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

      const res = await membershipsApi.KickMember(memberId, activeCommunity.id);

      if (!res.ok) throw new Error("Issue Kicking Member: ", res);

      if (memberId === user.id) {
        const communityRes = await communitiesApi.getUserCommunities(user.id);
        setUserCommunities(communityRes);
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
          onClick={() =>
            HandleKickMemberBtnClick(session.user.id, activeCommunity.id)
          }
        />
      </div>
    </div>
  );
}
