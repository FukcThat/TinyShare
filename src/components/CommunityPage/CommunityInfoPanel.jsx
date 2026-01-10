import { useGlobal } from '../../context/useGlobal';
import BgPanel from '../global/BgPanel';
import Loading from '../global/Loading';

export default function CommunityInfoPanel() {
  const { activeCommunity, communityMembers } = useGlobal();

  if (!activeCommunity || !communityMembers) return <Loading />;

  return (
    <BgPanel>
      <div className="text-start w-full text-2xl">{activeCommunity.name}</div>
      <div className="text-start w-full">
        {activeCommunity.description === '' ? '-' : activeCommunity.description}
      </div>
      <div className="flex w-full justify-start gap-2 sm:gap-4 md:gap-6">
        <div
          className={`${
            activeCommunity.role === 'admin' ? 'bg-accent' : 'bg-accent/20'
          } px-2 rounded-md`}
        >
          {activeCommunity.role === 'admin' ? 'Admin' : 'Member'}
        </div>
        <div>{communityMembers.length} Members</div>
        <div>Created {new Date(activeCommunity.created_at).toDateString()}</div>
      </div>
    </BgPanel>
  );
}
