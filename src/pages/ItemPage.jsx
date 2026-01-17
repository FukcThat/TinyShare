import { useParams } from 'react-router';
import { useMemo, useState } from 'react';
import Loading from '../components/global/Loading';
import { useSession } from '../context/session_context/useSession';
import { useGlobal } from '../context/useGlobal';
import ItemInfoPanel from '../components/ItemPage/ItemInfoPanel';
import BookingCalendar from '../components/ItemPage/BookingCalendar';
import RequestBookingForm from '../components/ItemPage/RequestBookingForm';
import ErrorText from '../components/ui/Text/ErrorText';

export default function ItemPage() {
  const { id } = useParams();
  const { session } = useSession();
  const { userItems, communityItems } = useGlobal();

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const item = useMemo(() => {
    if (communityItems.isPending || userItems.isPending) return null;
    if (communityItems.isError || userItems.isError) return null;

    return (
      communityItems.data.find((item) => item.id === id) ||
      userItems.data.find((item) => item.id === id) ||
      null
    );
  }, [communityItems, id, userItems]);

  if (communityItems.isPending || userItems.isPending) return <Loading />;

  return (
    <div className="flex flex-col justify-center items-center gap-8 my-6 ">
      {!communityItems.isError && !userItems.isError && item ? (
        <>
          <ItemInfoPanel item={item} />
          <BookingCalendar
            item={item}
            start={start}
            end={end}
            setEnd={setEnd}
            setStart={setStart}
          />
          {item.owner.id !== session.user.id && (
            <RequestBookingForm item={item} />
          )}
        </>
      ) : (
        <ErrorText text="Error getting item data from server" />
      )}
    </div>
  );
}
