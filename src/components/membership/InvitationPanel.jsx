import { useGlobal } from "../../context/useGlobal";
import Loading from "../global/Loading";
import Button from "../ui/Button";

export default function InvitationPanel() {
  const { userInvites, AcceptCommunityInvitation, DeleteCommunityInvitation } =
    useGlobal();
  return !userInvites ? (
    <Loading />
  ) : (
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
