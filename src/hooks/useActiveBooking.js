import { useMemo } from 'react';

export default function useActiveBooking(item) {
  const activeBooking = useMemo(() => {
    let curTime = new Date().getTime();

    for (let { start, end } of item.item_reservations) {
      if (
        new Date(start).getTime() < curTime &&
        new Date(end).getTime() > curTime
      ) {
        return { isBooked: true, start, end, ownerName: item.owner.name };
      }
    }
    return { isBooked: false, start: null, end: null, ownerName: null };
  }, [item]);

  return activeBooking;
}
