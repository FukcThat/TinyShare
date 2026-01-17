import { useMemo } from 'react';
import { useGlobal } from '../../context/useGlobal';
import BgPanel from '../global/BgPanel';
import Loading from '../global/Loading';
import ContentText from '../ui/Text/ContentText';
import HeaderText from '../ui/Text/HeaderText';
import SubContentText from '../ui/Text/SubContentText';
import ErrorText from '../ui/Text/ErrorText';

export default function CommunityInfoPanel() {
  const { activeCommunity, communityMembers } = useGlobal();

  const createdAtDateString = useMemo(
    () => new Date(activeCommunity.created_at).toDateString() || '',
    [activeCommunity]
  );

  return (
    <BgPanel>
      {!activeCommunity || communityMembers.isPending ? (
        <Loading />
      ) : (
        <>
          <HeaderText text={activeCommunity.name} />
          <ContentText text={activeCommunity.description || '-'} />
          <div className="flex w-full justify-start gap-2 sm:gap-4 md:gap-6">
            <div
              className={`${
                activeCommunity.role === 'admin' ? 'bg-accent' : 'bg-accent/20'
              } px-2 rounded-md`}
            >
              {activeCommunity.role === 'admin' ? 'Admin' : 'Member'}
            </div>
            {communityMembers.isError ? (
              <ErrorText text="Server Error" />
            ) : (
              <SubContentText
                text={`${communityMembers.data.length} Members`}
                styles="w-30 text-center"
              />
            )}
            <SubContentText text={`Created ${createdAtDateString}`} styles="" />
          </div>
        </>
      )}
    </BgPanel>
  );
}
