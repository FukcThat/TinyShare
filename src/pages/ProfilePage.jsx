import UserItemsView from '../components/ProfilePage/UserItemsView';
import ProfileHeader from '../components/ProfilePage/ProfileHeader';
import UserCommunitiesPanel from '../components/ProfilePage/UserCommunitiesPanel';
import useUserItems from '../hooks/tanstack_queries/useUserItems';

export default function ProfilePage() {
  const { data: userItems } = useUserItems();

  return (
    <div className="flex flex-col justify-center items-center gap-4 ">
      <ProfileHeader yourItems={userItems} />
      <UserCommunitiesPanel />
      <UserItemsView items={userItems} />
    </div>
  );
}
