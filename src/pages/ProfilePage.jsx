import UserItemsView from '../components/ProfilePage/UserItemsView';
import ProfileHeader from '../components/ProfilePage/ProfileHeader';
import UserCommunitiesPanel from '../components/ProfilePage/UserCommunitiesPanel';
import { useGlobal } from '../context/useGlobal';

export default function ProfilePage() {
  const { userItems } = useGlobal();

  return (
    <div className="flex flex-col justify-center items-center gap-4 pb-10 ">
      <ProfileHeader yourItems={userItems} />
      <UserCommunitiesPanel />
      <UserItemsView items={userItems} />
    </div>
  );
}
