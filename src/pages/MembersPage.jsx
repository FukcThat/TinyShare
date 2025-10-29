import { useNavigate } from "react-router";
import MembershipPanel from "../components/membership/MembershipPanel";
import Button from "../components/ui/Button";
import { useGlobal } from "../context/useGlobal";
import { useEffect } from "react";
import { useSession } from "../context/session_context/useSession";

export default function MembersPage() {
  const { user } = useSession();
  const { activeCommunity, KickMember } = useGlobal();

  const nav = useNavigate();

  useEffect(() => {
    if (!activeCommunity) return;
    if (activeCommunity.id === -1) nav("/");
  }, [activeCommunity]);

  return (
    <div>
      <MembershipPanel />
      <div>
        <Button text="🚶‍♀️‍➡️" onClick={() => KickMember(user.id)} />
      </div>
    </div>
  );
}
