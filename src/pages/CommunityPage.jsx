import { useNavigate } from 'react-router';
import CommunityInfoPanel from '../components/CommunityPage/CommunityInfoPanel';
import { useGlobal } from '../context/useGlobal';
import useKickMember from '../hooks/tanstack_mutations/useKickMember';
import { useEffect } from 'react';
import BgPanel from '../components/global/BgPanel';
import MembershipPanel from '../components/membership/MembershipPanel';
import CommunityAdminPanel from '../components/CommunityPage/CommunityAdminPanel';
import Loading from '../components/global/Loading';

export default function CommunityPage() {
  const { activeCommunity } = useGlobal();
  const kickMember = useKickMember();
  const nav = useNavigate();

  useEffect(() => {
    if (!activeCommunity) return;
    if (activeCommunity.id === -1) nav('/');
  }, [activeCommunity, nav]);

  const HandleKickMemberBtnClick = (memberId) => {
    kickMember.mutate({
      memberId,
      activeCommunity,
    });
  };

  if (!activeCommunity) return <Loading />;

  return (
    <div className="flex flex-col justify-center items-center gap-4 my-6">
      <CommunityInfoPanel />

      <div
        className={`w-[90%] flex flex-col ${
          activeCommunity.role === 'admin' && 'lg:grid gap-4 lg:grid-cols-3'
        } `}
      >
        <div className="lg:col-span-2">
          <BgPanel styles="w-full">
            <div className="text-2xl w-full text-start">
              👥 Community Members
            </div>
            <MembershipPanel
              HandleKickMemberBtnClick={HandleKickMemberBtnClick}
              isKickLoading={kickMember.isPending}
            />
          </BgPanel>
        </div>
        {activeCommunity.role === 'admin' && (
          <CommunityAdminPanel activeCommunity={activeCommunity} />
        )}
      </div>
    </div>
  );
}
