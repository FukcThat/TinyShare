import { useParams } from 'react-router';
import { useMemo, useState } from 'react';
import Loading from '../components/global/Loading';
import { useSession } from '../context/session_context/useSession';
import ItemInfoPanel from '../components/ItemPage/ItemInfoPanel';
import BookingCalendar from '../components/ItemPage/BookingCalendar';
import RequestBookingForm from '../components/ItemPage/RequestBookingForm';
import ErrorText from '../components/ui/Text/ErrorText';
import useItem from '../hooks/tanstack_queries/useItem';

export default function ItemPage() {
  const { id } = useParams();
  const { session } = useSession();
  const item = useItem(id);

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const itemData = useMemo(
    () => (item.isPending ? null : item.isError ? null : item.data[0]),
    [item],
  );

  if (item.isPending) return <Loading />;

  return (
    <div className="flex flex-col justify-center items-center gap-8 my-6 ">
      {!itemData.isError && itemData ? (
        <>
          <ItemInfoPanel item={itemData} />
          <BookingCalendar
            item={itemData}
            start={start}
            end={end}
            setEnd={setEnd}
            setStart={setStart}
          />
          {itemData.owner.id !== session.user.id && (
            <RequestBookingForm item={itemData} />
          )}
        </>
      ) : (
        <ErrorText text="Error getting item data from server" />
      )}
    </div>
  );
}
