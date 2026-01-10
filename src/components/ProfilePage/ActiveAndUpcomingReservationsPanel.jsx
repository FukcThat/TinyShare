import { useMemo } from 'react';
import BgPanel from '../global/BgPanel';
import { Link } from 'react-router';
import { useGlobal } from '../../context/useGlobal';

export default function ActiveAndUpcomingReservationsPanel() {
  const { userReservations } = useGlobal();

  const activeReservations = useMemo(() => {
    if (!userReservations) return [];
    return userReservations.filter(
      (res) =>
        new Date(res.start).getTime() < new Date().getTime() &&
        new Date(res.end).getTime() > new Date().getTime()
    );
  }, [userReservations]);

  const upcomingReservations = useMemo(() => {
    if (!userReservations) return [];
    return userReservations
      .filter((res) => new Date(res.start).getTime() > new Date().getTime())
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      );
  }, [userReservations]);
  return (
    <BgPanel styles="flex flex-col md:grid md:grid-cols-2 ">
      <div className="flex flex-col items-start justify-start h-full w-full gap-2">
        <h3 className="text-2xl">Active Bookings</h3>
        <div className="flex flex-col gap-2 w-full">
          {activeReservations.map((res) => (
            <Link
              to={`/items/${res.item.id}`}
              className="border border-accent/40 hover:border-accent/60 p-2 rounded-md"
              key={res.id}
            >
              <div className="text-lg">{res.item.name}</div>
              <div className="text-sm text-text-primary/80 truncate">
                {res.item.description || '-'} | Owner: {res.user.name}
              </div>
              {new Date(res.end).toLocaleDateString() ===
              new Date().toLocaleDateString() ? (
                <div>
                  Booking Ends Today at {new Date(res.end).toLocaleTimeString()}{' '}
                </div>
              ) : (
                <div>
                  Booking Ends at {new Date(res.end).toLocaleTimeString()} on
                  the {new Date(res.end).toLocaleDateString()}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start justify-start h-full w-full gap-2">
        <h3 className="text-2xl">Upcoming Bookings</h3>
        <div className="flex flex-col gap-2 w-full">
          {upcomingReservations.map((res) => (
            <Link
              to={`/items/${res.item.id}`}
              className="border border-accent/40 hover:border-accent/60 p-2 rounded-md"
              key={res.id}
            >
              <div className="text-lg">{res.item.name}</div>
              <div className="text-sm text-text-primary/80 truncate">
                {res.item.description || '-'} | Owner: {res.user.name}
              </div>
              {new Date(res.start).toLocaleDateString() ===
              new Date().toLocaleDateString() ? (
                <div>
                  Booking Starts Today at{' '}
                  {new Date(res.start).toLocaleTimeString()}{' '}
                </div>
              ) : (
                <div>
                  Booking Starts at {new Date(res.start).toLocaleTimeString()}{' '}
                  on the {new Date(res.start).toLocaleDateString()}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </BgPanel>
  );
}
