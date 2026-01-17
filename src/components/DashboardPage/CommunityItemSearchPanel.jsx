import { useMemo, useState } from 'react';
import HeaderText from '../ui/Text/HeaderText';
import { useGlobal } from '../../context/useGlobal';
import { HasReservationConflict } from '../../lib/HasReservationConflict';
import BgPanel from '../global/BgPanel';
import Input from '../ui/Input';
import ItemListView from './ItemListView';
import AvailabilityCheck from './AvailabilityCheck';
import Loading from '../global/Loading';
import ErrorText from '../ui/Text/ErrorText';

export default function CommunityItemSearchPanel() {
  const [availabilityFilterDates, setAvailabilityFilterDates] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { activeCommunity, communityItems } = useGlobal();

  const itemsToRender = useMemo(() => {
    if (communityItems.isPending || communityItems.isError) return [];

    const q = searchQuery.toLowerCase().trim();
    const hasDates =
      availabilityFilterDates?.start && availabilityFilterDates?.end;

    return communityItems.data.filter((item) => {
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

  return (
    <BgPanel>
      <HeaderText text={`${activeCommunity.name} - Available Items`} />
      <Input
        isSearch
        outerStyles="flex-col w-full"
        labelStyles="text-start text-sm w-full"
        id="search-query-input"
        maxLength={50}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name, description or owner..."
        disabled={communityItems.isPending}
      />
      <AvailabilityCheck
        setAvailabilityFilterDates={setAvailabilityFilterDates}
      />
      {communityItems.isPending ? (
        <Loading />
      ) : communityItems.isError ? (
        <ErrorText text="Error getting items from server" />
      ) : (
        <ItemListView items={itemsToRender} />
      )}
    </BgPanel>
  );
}
