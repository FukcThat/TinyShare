import { useEffect, useMemo, useState } from 'react';
import ItemListView from '../components/ItemPage/ItemListView';
import { useGlobal } from '../context/useGlobal';
import AvailabilityCheck from '../components/ItemPage/AvailabilityCheck';
import { HasReservationConflict } from '../lib/HasReservationConflict';
import { useNavigate } from 'react-router';
import BgPanel from '../components/global/BgPanel';
import Input from '../components/ui/Input';
import ActiveAndUpcomingReservationsPanel from '../components/ProfilePage/ActiveAndUpcomingReservationsPanel';
import CurrentlyBookedUserItemsPanel from '../components/ProfilePage/CurrentlyBookedUserItemsPanel';

export default function Dashboard() {
  const { activeCommunity, communityItems } = useGlobal();

  const [availabilityFilterDates, setAvailabilityFilterDates] = useState('');
  const nav = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!activeCommunity) return;
    if (activeCommunity.id === -1) nav('/');
  }, [activeCommunity, nav]);

  const itemsToRender = useMemo(() => {
    if (!communityItems) return [];

    const q = searchQuery.toLowerCase().trim();
    const hasDates =
      availabilityFilterDates?.start && availabilityFilterDates?.end;

    return communityItems.filter((item) => {
      if (!item.is_available) return false;

      if (hasDates) {
        const { start, end } = availabilityFilterDates;
        if (HasReservationConflict(item.item_reservations, start, end)) {
          return false;
        }
      }

      if (!q) return true;

      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.owner.name.toLowerCase().includes(q)
      );
    });
  }, [availabilityFilterDates, communityItems, searchQuery]);

  if (!activeCommunity || activeCommunity.id === -1) return null;

  return (
    <div className="flex flex-col justify-center items-center gap-4 ">
      <ActiveAndUpcomingReservationsPanel />
      <CurrentlyBookedUserItemsPanel />
      <BgPanel>
        <h2 className=" text-2xl w-full text-start">
          {activeCommunity.name} - Available Items
        </h2>
        <Input
          outerStyles="flex-col w-full"
          labelStyles="text-start text-sm w-full"
          id="search-query-input"
          withLabel
          labelText="Search available items"
          maxLength={50}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, description or owner..."
        />
        <AvailabilityCheck
          setAvailabilityFilterDates={setAvailabilityFilterDates}
        />
        <ItemListView items={itemsToRender} />
      </BgPanel>
    </div>
  );
}
