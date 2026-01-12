import { useParams } from 'react-router';
import { useMemo, useState } from 'react';
import Loading from '../components/global/Loading';
import { useSession } from '../context/session_context/useSession';
import { useGlobal } from '../context/useGlobal';
import ItemInfoPanel from '../components/ItemPage/ItemInfoPanel';
import BookingCalendar from '../components/ItemPage/BookingCalendar';
import RequestBookingForm from '../components/ItemPage/RequestBookingForm';

export default function ItemPage() {
  const { id } = useParams();
  const { session } = useSession();
  const { userItemData, communityItems } = useGlobal();

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const item = useMemo(() => {
    if (!communityItems && !userItemData) return null;
    return (
      communityItems?.find((item) => item.id === id) ||
      userItemData?.find((item) => item.id === id) ||
      null
    );
  }, [communityItems, id, userItemData]);

  if (!item) return <Loading />;

  return (
    <div className="flex flex-col justify-center items-center gap-8 my-6 ">
      <ItemInfoPanel item={item} />
      <BookingCalendar
        item={item}
        start={start}
        end={end}
        setEnd={setEnd}
        setStart={setStart}
      />
      {item.owner.id !== session.user.id && <RequestBookingForm item={item} />}
    </div>
  );
}
