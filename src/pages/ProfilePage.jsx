import { useMemo } from 'react';
import { useSession } from '../context/session_context/useSession';
import useCommunityItems from '../hooks/tanstack_queries/useCommunityItems';
import UserItemsView from '../components/ProfilePage/UserItemsView';
import ProfileHeader from '../components/ProfilePage/ProfileHeader';
import UserCommunitiesPanel from '../components/ProfilePage/UserCommunitiesPanel';

export default function ProfilePage() {
  const { session } = useSession();
  const { data: communityItems } = useCommunityItems();

  const yourItems = useMemo(
    () =>
      communityItems
        ? communityItems.filter((item) => item.owner.id === session.user.id)
        : null,
    [communityItems, session]
  );

  return (
    <div className="flex flex-col justify-center items-center gap-4 ">
      <ProfileHeader yourItems={yourItems} />
      <UserCommunitiesPanel />
      <UserItemsView items={yourItems} />
    </div>
  );
}
