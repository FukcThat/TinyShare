import BgPanel from '../global/BgPanel';
import { AdminShieldIcon } from '../ui/Icons/Icons';
import HeaderText from '../ui/Text/HeaderText';
import CommunityInvitePanel from './CommunityInvitePanel';
import EditCommunityPanel from './EditCommunityPanel';

export default function CommunityAdminPanel({ activeCommunity }) {
  return (
    <div className="lg:col-span-1 flex flex-col gap-2">
      <BgPanel styles="w-full flex flex-row gap-2 items-center">
        <AdminShieldIcon />
        <HeaderText text={'Admin Panel'} />
      </BgPanel>
      <EditCommunityPanel activeCommunity={activeCommunity} />
      <CommunityInvitePanel />
    </div>
  );
}
