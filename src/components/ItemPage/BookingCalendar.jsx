import { useEffect, useMemo, useState } from 'react';
import BgPanel from '../global/BgPanel';
import { useSession } from '../../context/session_context/useSession';
import { FormatDateStringAddHalfHour } from '../../lib/FormatDateStringAddHalfHour';
import { HasReservationConflict } from '../../lib/HasReservationConflict';
import EventContent from '../ItemPage/EventContent';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/react';
import { BookingStatus } from '../../lib/BookingStatus';
import HeaderText from '../ui/Text/HeaderText';
import SubContentText from '../ui/Text/SubContentText';
import useSubmitItemReservation from '../../hooks/tanstack_mutations/useSubmitItemReservation';

const LegendData = [
  { text: 'Current Booking', color: 'bg-accent' },
  { text: 'Requested Booking', color: 'bg-orange-600' },
  { text: 'Confirmed Booking', color: 'bg-green-600' },
];

export default function BookingCalendar({
  item,
  start,
  end,
  setStart,
  setEnd,
}) {
  const { session } = useSession();
  const [reservation, setReservation] = useState(null);
  const SubmitItemReservation = useSubmitItemReservation();
  const resetTimeState = () => {
    setStart('');
    setEnd('');
  };
  const OnSubmitReservation = async (e, selfBooking = false) => {
    e.preventDefault();
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
        status: selfBooking ? BookingStatus.booking : BookingStatus.request,
      },
      {
        onSuccess: () => {
          resetTimeState();
        },
      }
    );
  };

  useEffect(() => {
    if (start != '' && end != '') {
      setReservation({
        title: 'Your Reservation',
        start,
        end,
        backgroundColor: '#76abae',
        status: BookingStatus.preview,
      });
    } else {
      setReservation(null);
    }
  }, [end, start]);

  const itemReservations = useMemo(() => {
    if (!item) return [];

    return item.item_reservations.map((res) => {
      console.log(res);

      return {
        title:
          (res.status === BookingStatus.request
            ? 'Requested by: '
            : 'Booked by: ') +
          (res.user_id.id === session.user.id ? 'You' : res.user_id.name),
        start: res.start,
        end: res.end,
        resId: res.id,
        status: res.status,
        userId: res.user_id.id,
        backgroundColor:
          res.status === BookingStatus.booking
            ? 'green'
            : 'hsla(30, 100%, 50%, 1)',
      };
    });
  }, [item, session]);

  const SetTime = (time) => {
    if (start == '' || end != '') {
      setStart(time);
      setEnd('');
    } else {
      const startDate = new Date(start);
      let endDate = new Date(time);
      if (endDate <= startDate) {
        time = FormatDateStringAddHalfHour(startDate);
        endDate = new Date(time);
      }
      if (!HasReservationConflict(itemReservations, startDate, endDate))
        setEnd(time);
      else window.alert('Conflict Exists!');
    }
  };

  const renderEventContent = (arg) => {
    return (
      <EventContent
        arg={arg}
        OnSubmitReservation={OnSubmitReservation}
        setStartTime={setStart}
        setEndTime={setEnd}
        editable={arg.event._def.extendedProps.status === BookingStatus.preview}
        item={item}
      />
    );
  };

  return (
    <BgPanel>
      <HeaderText
        text="📆 Booking Calendar"
        styles="border-b border-accent pb-4"
      />
      <div className="w-full h-[600px]">
        <FullCalendar
          plugins={[interactionPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          eventContent={renderEventContent}
          events={
            reservation ? [...itemReservations, reservation] : itemReservations
          }
          scrollTime={new Date().toTimeString()}
          editable={true}
          eventOverlap={false}
          allDaySlot={false}
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'timeGridWeek,timeGridDay', // user can switch between the two
          }}
          height={'100%'}
          selectable={true}
          eventAllow={(_newInfo, obj) => {
            return obj._def.extendedProps.status === BookingStatus.preview;
          }}
          nowIndicator={true}
          buttonText={{ week: 'Week', day: 'Day' }}
          titleFormat={{ year: '2-digit', month: 'short', day: 'numeric' }}
          eventResize={(e) => {
            setStart(e.event.start.toISOString());
            setEnd(e.event.end.toISOString());
          }}
          eventDrop={(e) => {
            setStart(e.event.start.toISOString());
            setEnd(e.event.end.toISOString());
          }}
          dateClick={(e) => SetTime(e.dateStr)}
          firstDay={1}
        />
      </div>

      <div className="flex items-center justify-center flex-col sm:flex-row w-full gap-2 p-2">
        {LegendData.map(({ text, color }) => (
          <div className="flex gap-1 items-center">
            <div className={`h-4 w-4 rounded-md ${color}`}></div>
            <SubContentText text={text} />
          </div>
        ))}
      </div>
    </BgPanel>
  );
}
