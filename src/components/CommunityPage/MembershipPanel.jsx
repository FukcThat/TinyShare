import { useGlobal } from '../../context/useGlobal';
import Loading from '../global/Loading';
import { useSession } from '../../context/session_context/useSession';
import ErrorText from '../ui/Text/ErrorText';
import MemberInfoRow from './MemberInfoRow';

export default function MembershipPanel() {
  const { communityMembers, userCommunities } = useGlobal();
  const { session } = useSession();

  if (!session || userCommunities.isPending || communityMembers.isPending)
    return <Loading />;

  if (userCommunities.isError || communityMembers.isError)
    return <ErrorText text="Error getting community Data from server" />;

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 py-4">
      {communityMembers.data
        .sort((a, b) => a.id - b.id)
        .map((member) => (
          <MemberInfoRow key={member.profiles.id} member={member} />
        ))}
    </div>
  );
}
