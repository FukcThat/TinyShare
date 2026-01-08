import UserItemsView from '../components/ProfilePage/UserItemsView';
import ProfileHeader from '../components/ProfilePage/ProfileHeader';
import UserCommunitiesPanel from '../components/ProfilePage/UserCommunitiesPanel';
import useUserItems from '../hooks/tanstack_queries/useUserItems';
import ActiveAndUpcomingReservationsPanel from '../components/ProfilePage/ActiveAndUpcomingReservationsPanel';
import CurrentlyBookedUserItemsPanel from '../components/ProfilePage/CurrentlyBookedUserItemsPanel';

export default function ProfilePage() {
  const { data: userItems } = useUserItems();

  return (
    <div className="flex flex-col justify-center items-center gap-4 pb-10 ">
      <ProfileHeader yourItems={userItems} />
      <UserCommunitiesPanel />
      <ActiveAndUpcomingReservationsPanel />
      <CurrentlyBookedUserItemsPanel userItems={userItems} />
      <UserItemsView items={userItems} />
    </div>
  );
}
