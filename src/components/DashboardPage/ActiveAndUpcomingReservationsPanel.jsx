import { useMemo } from 'react';
import BgPanel from '../global/BgPanel';
import { useGlobal } from '../../context/useGlobal';
import HeaderText from '../ui/Text/HeaderText';
import ReservationView from './ReservationView';
import {
  ActiveBookingIcon,
  PendingRequestIcon,
  UpcomingBookingIcon,
} from '../ui/Icons/Icons';
import Loading from '../global/Loading';
import SubContentText from '../ui/Text/SubContentText';
import ErrorText from '../ui/Text/ErrorText';
import { BookingStatus } from '../../lib/BookingStatus';

export default function ActiveAndUpcomingReservationsPanel() {
  const { userReservations } = useGlobal();

  const activeReservations = useMemo(() => {
    if (userReservations.isPending || userReservations.isError) return [];
    return userReservations.data.filter(
      (res) =>
        new Date(res.start).getTime() < new Date().getTime() &&
        new Date(res.end).getTime() > new Date().getTime(),
    );
  }, [userReservations]);

  const upcomingReservations = useMemo(() => {
    if (userReservations.isPending || userReservations.isError) return [];
    return userReservations.data
      .filter((res) => res.status != BookingStatus.request)
      .filter((res) => new Date(res.start).getTime() > new Date().getTime())
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
  }, [userReservations]);

  const pendingReservationRequests = useMemo(() => {
    if (userReservations.isPending || userReservations.isError) return [];
    return userReservations.data
      .filter((res) => res.status === BookingStatus.request)
      .filter((res) => new Date(res.start).getTime() > new Date().getTime())
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
  }, [userReservations]);

  return (
    <BgPanel styles="flex flex-col md:grid md:grid-cols-2 ">
      <div className="flex flex-col items-start justify-start h-full w-full gap-2">
        <div className="flex items-center gap-2">
          <ActiveBookingIcon />
          <HeaderText text="Active Bookings" />
        </div>
        {userReservations.isPending ? (
          <Loading />
        ) : userReservations.isError ? (
          <ErrorText text="Error getting user reservations from server" />
        ) : (
          <div className="flex flex-col gap-2 w-full">
            {activeReservations.length === 0 && (
              <SubContentText text="No Active Bookings" />
            )}

            {activeReservations.map((res) => (
              <ReservationView key={res.id} res={res} isActiveRes />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-start justify-start h-full w-full gap-2">
        <div className="flex items-center gap-2">
          <UpcomingBookingIcon />
          <HeaderText text="Upcoming Reservations" />
        </div>
        {userReservations.isPending ? (
          <Loading />
        ) : userReservations.isError ? (
          <ErrorText text="Error getting user reservations from server" />
        ) : (
          <div className="flex flex-col gap-2 w-full">
            {upcomingReservations.length === 0 && (
              <SubContentText text="No Upcoming Reservations" />
            )}
            {upcomingReservations.map((res) => (
              <ReservationView key={res.id} res={res} />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col items-start justify-start h-full w-full gap-2">
        <div className="flex items-center gap-2">
          <PendingRequestIcon />
          <HeaderText text="Pending Requests" />
        </div>
        {userReservations.isPending ? (
          <Loading />
        ) : userReservations.isError ? (
          <ErrorText text="Error getting user reservations from server" />
        ) : (
          <div className="flex flex-col gap-2 w-full">
            {pendingReservationRequests.length === 0 && (
              <SubContentText text="No Upcoming Reservations" />
            )}
            {pendingReservationRequests.map((res) => (
              <ReservationView key={res.id} res={res} />
            ))}
          </div>
        )}
      </div>
    </BgPanel>
  );
}
