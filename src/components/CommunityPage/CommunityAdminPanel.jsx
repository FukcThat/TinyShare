import BgPanel from '../global/BgPanel';
import HeaderText from '../ui/Text/HeaderText';
import CommunityInvitePanel from './CommunityInvitePanel';
import EditCommunityPanel from './EditCommunityPanel';

export default function CommunityAdminPanel({ activeCommunity }) {
  return (
    <div className="lg:col-span-1 flex flex-col gap-2">
      <BgPanel styles="w-full">
        <HeaderText text="🛡️ Admin Panel" />
      </BgPanel>
      <EditCommunityPanel activeCommunity={activeCommunity} />
      <CommunityInvitePanel />
    </div>
  );
}
