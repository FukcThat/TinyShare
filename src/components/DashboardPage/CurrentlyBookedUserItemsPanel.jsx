import { useMemo } from 'react';
import BgPanel from '../global/BgPanel';
import { Link } from 'react-router';
import { useGlobal } from '../../context/useGlobal';
import HeaderText from '../ui/Text/HeaderText';
import ContentText from '../ui/Text/ContentText';
import FadedText from '../ui/Text/FadedText';
import SubContentText from '../ui/Text/SubContentText';

export default function CurrentlyBookedUserItemsPanel() {
  const { userItems } = useGlobal();
  const currentlyBookedItems = useMemo(() => {
    if (!userItems) return [];

    const now = Date.now();

    const isActive = (res) => {
      const start = new Date(res.start).getTime();
      const end = new Date(res.end).getTime();
      return start < now && end > now;
    };

    const result = userItems
      .map((item) => {
        const active = item.item_reservations.find(isActive);
        if (!active) return null;

        return {
          ...item,
          booked_by: active.user_id?.name ?? '',
          booked_until: active.end ?? '',
          _endTs: new Date(active.end).getTime(),
        };
      })
      .filter(Boolean);

    result.sort((a, b) => a._endTs - b._endTs);

    return result;
  }, [userItems]);
  return (
    <BgPanel>
      <HeaderText text="My Booked Items" />
      <div className="w-full">
        {currentlyBookedItems.map((item) => (
          <Link
            to={`items/${item.id}`}
            key={item.id}
            className="border border-accent/40 hover:border-accent/60 p-2 rounded-md flex flex-col w-full"
          >
            <ContentText text={item.name} />
            <FadedText text={item.description} styles="truncate" />
            <SubContentText text={`Booked by: ${item.booked_by}`} />
            {new Date(item.booked_until).toLocaleDateString() ===
            new Date().toLocaleDateString() ? (
              <SubContentText
                text={`Booking Ends Today at 
                ${new Date(item.booked_until).toLocaleTimeString()}`}
              />
            ) : (
              <SubContentText
                text={`Booking Ends at 
                ${new Date(item.booked_until).toLocaleTimeString()} on the{' '}
                ${new Date(item.booked_until).toLocaleDateString()}`}
              />
            )}
          </Link>
        ))}
      </div>
    </BgPanel>
  );
}
