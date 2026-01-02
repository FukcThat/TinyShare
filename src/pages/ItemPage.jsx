import { useParams } from 'react-router';
import useCommunityItems from '../hooks/tanstack_queries/useCommunityItems';
import { useMemo, useState } from 'react';
import Loading from '../components/global/Loading';
import ItemInfoPanel from '../components/NewItemPage/ItemInfoPanel';
import BookingCalendar from '../components/NewItemPage/BookingCalendar';
import { useSession } from '../context/session_context/useSession';
import RequestBookingForm from '../components/NewItemPage/RequestBookingForm';
import useSubmitItemReservation from '../hooks/tanstack_mutations/useSubmitItemReservation';
import BookingHistory from '../components/NewItemPage/BookingHistory';

export default function ItemPage() {
  const { id } = useParams();
  const { session } = useSession();
  const { data } = useCommunityItems();

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const item = useMemo(() => {
    return data?.find((item) => item.id === id) || null;
  }, [data, id]);

  const resetTimeState = () => {
    setStart('');
    setEnd('');
  };

  const SubmitItemReservation = useSubmitItemReservation();

  const OnSubmitReservation = async (e, selfBooking = false) => {
    e.preventDefault();
    if (start === '' || end === '') return;
    SubmitItemReservation.mutate(
      {
        user_id: session.user.id,
        item_id: item.id,
        start,
        end,
        status: selfBooking ? 'booking' : 'request', // turn this into global enums
      },
      {
        onSuccess: () => {
          resetTimeState();
        },
      }
    );
  };

  if (!data) return <Loading />;

  return (
    <div className="flex flex-col justify-center items-center gap-8 py-10">
      <ItemInfoPanel item={item} />
      {/* Edit Item Form */}
      <BookingCalendar
        item={item}
        start={start}
        end={end}
        setEnd={setEnd}
        setStart={setStart}
        OnSubmitReservation={OnSubmitReservation}
      />
      {/* <BookingHistory /> */}
      {item.owner !== session.user.id && (
        <RequestBookingForm
          start={start}
          end={end}
          OnSubmitReservation={OnSubmitReservation}
          SubmitItemReservation={SubmitItemReservation}
          item={item}
        />
      )}
    </div>
  );
}
