import { useMemo } from 'react';
import BgPanel from '../global/BgPanel';
import { useGlobal } from '../../context/useGlobal';
import HeaderText from '../ui/Text/HeaderText';
import ReservationView from './ReservationView';

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
        <HeaderText text="Active Bookings" />
        <div className="flex flex-col gap-2 w-full">
          {activeReservations.map((res) => (
            <ReservationView res={res} isActiveRes />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start justify-start h-full w-full gap-2">
        <HeaderText text="Upcoming Bookings" />
        <div className="flex flex-col gap-2 w-full">
          {upcomingReservations.map((res) => (
            <ReservationView res={res} />
          ))}
        </div>
      </div>
    </BgPanel>
  );
}
