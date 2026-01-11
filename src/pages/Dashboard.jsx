import { useGlobal } from '../context/useGlobal';
import useCommunityRouteGuard from '../hooks/useNoCommunityRouteGuard';
import { InvalidCommunityId } from '../lib/InvalidCommunityId';
import ActiveAndUpcomingReservationsPanel from '../components/DashboardPage/ActiveAndUpcomingReservationsPanel';
import CurrentlyBookedUserItemsPanel from '../components/DashboardPage/CurrentlyBookedUserItemsPanel';
import CommunityItemSearchPanel from '../components/DashboardPage/CommunityItemSearchPanel';

export default function Dashboard() {
  useCommunityRouteGuard();

  const { activeCommunity } = useGlobal();

  if (!activeCommunity || activeCommunity.id === InvalidCommunityId)
    return null;

  return (
    <div className="flex flex-col justify-center items-center gap-4 ">
      <ActiveAndUpcomingReservationsPanel />
      <CurrentlyBookedUserItemsPanel />
      <CommunityItemSearchPanel />
    </div>
  );
}
