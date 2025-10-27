import { useGlobal } from "../../context/useGlobal";
import Button from "../ui/Button";

export default function InvitationPanel() {
  const { userInvites, AcceptCommunityInvitation, DeleteCommunityInvitation } =
    useGlobal();
  return (
    <div>
      {userInvites.map((invite) => (
        <div key={invite.id}>
          <div> Invitation to {invite.communityId}</div>
          <Button
            text="✔️"
            onClick={() =>
              AcceptCommunityInvitation(
                invite.communityId,
                invite.role,
                invite.id
              )
            }
          />
          <Button
            text="❌"
            onClick={() => DeleteCommunityInvitation(invite.id)}
          />
        </div>
      ))}
    </div>
  );
}
