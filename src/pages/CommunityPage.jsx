import CommunityInfoPanel from '../components/CommunityPage/CommunityInfoPanel';
import { useGlobal } from '../context/useGlobal';
import BgPanel from '../components/global/BgPanel';
import CommunityAdminPanel from '../components/CommunityPage/CommunityAdminPanel';
import Loading from '../components/global/Loading';
import useCommunityRouteGuard from '../hooks/useNoCommunityRouteGuard';
import HeaderText from '../components/ui/Text/HeaderText';
import MembershipPanel from '../components/CommunityPage/MembershipPanel';

export default function CommunityPage() {
  useCommunityRouteGuard();

  const { activeCommunity } = useGlobal();

  if (!activeCommunity) return <Loading />;

  return (
    <div className="flex flex-col justify-center items-center gap-4 ">
      <CommunityInfoPanel />
      <div
        className={`w-[90%] flex flex-col ${
          activeCommunity.role === 'admin' && 'lg:grid gap-4 lg:grid-cols-3'
        } `}
      >
        <div className="lg:col-span-2">
          <BgPanel styles="w-full">
            <HeaderText text={'Community Members'} />
            <MembershipPanel />
          </BgPanel>
        </div>
        {activeCommunity.role === 'admin' && (
          <CommunityAdminPanel activeCommunity={activeCommunity} />
        )}
      </div>
    </div>
  );
}
