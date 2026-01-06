import BgPanel from '../global/BgPanel';
import CommunityInvitePanel from './CommunityInvitePanel';
import EditCommunityPanel from './EditCommunityPanel';

export default function CommunityAdminPanel({ activeCommunity }) {
  return (
    <div className="lg:col-span-1 flex flex-col gap-2">
      <BgPanel styles="w-full">
        <div className="w-full text-2xl ">🛡️ Admin Panel</div>
      </BgPanel>
      <EditCommunityPanel activeCommunity={activeCommunity} />
      <CommunityInvitePanel />
    </div>
  );
}
