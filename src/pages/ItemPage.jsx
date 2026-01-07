import { useParams } from 'react-router';
import useCommunityItems from '../hooks/tanstack_queries/useCommunityItems';
import { useMemo, useState } from 'react';
import Loading from '../components/global/Loading';
import ItemInfoPanel from '../components/NewItemPage/ItemInfoPanel';
import BookingCalendar from '../components/NewItemPage/BookingCalendar';
import { useSession } from '../context/session_context/useSession';
import RequestBookingForm from '../components/NewItemPage/RequestBookingForm';
import useSubmitItemReservation from '../hooks/tanstack_mutations/useSubmitItemReservation';
import useUserItems from '../hooks/tanstack_queries/useUserItems';

export default function ItemPage() {
  const { id } = useParams();
  const { session } = useSession();
  const { data: communityItemData } = useCommunityItems();
  const { data: userItemData } = useUserItems();

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const item = useMemo(() => {
    if (!communityItemData && !userItemData) return null;
    return (
      communityItemData?.find((item) => item.id === id) ||
      userItemData?.find((item) => item.id === id) ||
      null
    );
  }, [communityItemData, id, userItemData]);

  const resetTimeState = () => {
    setStart('');
    setEnd('');
  };

  const SubmitItemReservation = useSubmitItemReservation();

  const OnSubmitReservation = async (e, selfBooking = false) => {
    e.preventDefault();
    // make sure that the reservation start time is in the future
    let curTime = new Date().getTime();
    if (curTime > new Date(start).getTime()) {
      window.alert('Start of booking must be in the future!');
      return;
    }
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

  if (!item) return <Loading />;

  return (
    <div className="flex flex-col justify-center items-center gap-8 my-6">
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
