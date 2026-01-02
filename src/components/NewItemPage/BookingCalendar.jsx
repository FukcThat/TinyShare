import { useEffect, useMemo, useState } from 'react';
import BgPanel from '../global/BgPanel';
import { useSession } from '../../context/session_context/useSession';
import { FormatDateStringAddHalfHour } from '../../lib/FormatDateStringAddHalfHour';
import { HasReservationConflict } from '../../lib/HasReservationConflict';
import EventContent from '../ItemPage/EventContent';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/react';

export default function BookingCalendar({
  item,
  start,
  end,
  setStart,
  setEnd,
  OnSubmitReservation,
}) {
  const { session } = useSession();
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    if (start != '' && end != '') {
      setReservation({
        title: 'Your Reservation',
        start,
        end,
        backgroundColor: 'green',
        status: 'preview',
      });
    } else {
      setReservation(null);
    }
  }, [end, start]);

  const itemReservations = useMemo(() => {
    if (!item) return [];

    return item.item_reservations.map((res) => {
      return {
        title:
          'user: ' + (res.user_id === session.user.id ? 'You' : res.user_id),
        start: res.start,
        end: res.end,
        resId: res.id,
        status: res.status,
        userId: res.user_id,
        backgroundColor:
          res.status === 'booking'
            ? 'hsla(357, 100%, 64%, 1)'
            : 'hsla(40, 100%, 50%, 1)',
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
        editable={arg.event._def.extendedProps.status === 'preview'}
        item={item}
      />
    );
  };

  return (
    <BgPanel>
      <h3 className="w-full text-xl">📆 Booking Calendar</h3>

      <div className="w-full h-[600px]">
        <FullCalendar
          plugins={[interactionPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          eventContent={renderEventContent}
          events={
            reservation ? [...itemReservations, reservation] : itemReservations
          }
          editable={true}
          eventOverlap={false}
          allDaySlot={false}
          headerToolbar={{
            left: 'prev',
            center: 'title,timeGridWeek,timeGridDay',
            right: 'next', // user can switch between the two
          }}
          height={'100%'}
          selectable={true}
          eventAllow={(_newInfo, obj) => {
            return obj._def.extendedProps.status === 'preview';
          }}
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
    </BgPanel>
  );
}
