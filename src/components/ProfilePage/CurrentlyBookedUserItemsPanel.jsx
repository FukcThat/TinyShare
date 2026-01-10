import { useMemo } from 'react';
import BgPanel from '../global/BgPanel';
import { Link } from 'react-router';
import { useGlobal } from '../../context/useGlobal';

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
      <h3 className="text-2xl">My Booked Items</h3>
      <div className="w-full">
        {currentlyBookedItems.map((item) => (
          <Link
            to={`items/${item.id}`}
            key={item.id}
            className="border border-accent/40 hover:border-accent/60 p-2 rounded-md flex flex-col w-full"
          >
            <div className="text-lg">{item.name}</div>
            <div className="text-sm text-text-primary/80">
              {item.description}
            </div>
            <div>Booked by: {item.booked_by}</div>
            {new Date(item.booked_until).toLocaleDateString() ===
            new Date().toLocaleDateString() ? (
              <div>
                Booking Ends Today at{' '}
                {new Date(item.booked_until).toLocaleTimeString()}
              </div>
            ) : (
              <div>
                Booking Ends at{' '}
                {new Date(item.booked_until).toLocaleTimeString()} on the{' '}
                {new Date(item.booked_until).toLocaleDateString()}
              </div>
            )}
          </Link>
        ))}
      </div>
    </BgPanel>
  );
}
