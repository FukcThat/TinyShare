import Loading from '../global/Loading';
import { useGlobal } from '../../context/useGlobal';
import FadedText from '../ui/Text/FadedText';
import ErrorText from '../ui/Text/ErrorText';
import UserInvitationPanel from './UserInvitationPanel';

export default function InvitationPanel() {
  const { userInvitations } = useGlobal();

  return userInvitations.isPending ? (
    <Loading />
  ) : userInvitations.isError ? (
    <ErrorText text="Error getting user invitations from server" />
  ) : (
    <div
      className={`${
        userInvitations.data.length != 0 &&
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      } border-t border-b py-2 border-accent w-full gap-2`}
    >
      {userInvitations.data.length === 0 && (
        <FadedText text="No pending invites" styles="text-center" />
      )}
      {userInvitations.data.map((invite) => (
        <UserInvitationPanel key={invite.id} invite={invite} />
      ))}
    </div>
  );
}
