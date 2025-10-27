import { useNavigate } from "react-router";
import MembershipPanel from "../components/membership/MembershipPanel";
import Button from "../components/ui/Button";
import { useGlobal } from "../context/useGlobal";
import { useEffect } from "react";

export default function MembersPage() {
  const { user, activeCommunity, KickMember } = useGlobal();

  const nav = useNavigate();

  useEffect(() => {
    if (!activeCommunity) return;
    if (activeCommunity.id === 0) nav("/");
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
