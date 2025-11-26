import Button from "../ui/Button";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for selectable
import { useEffect, useMemo, useState } from "react";
import { FormatDateStringAddHalfHour } from "../../lib/FormatDateStringAddHalfHour";
import { HasReservationConflict } from "../../lib/HasReservationConflict";
import { useItemContext } from "../../context/item_context/useItemContext";
import EventContent from "./EventContent";
import { useSession } from "../../context/session_context/useSession";
import useSubmitItemReservation from "../../hooks/tanstack_mutations/useSubmitItemReservation";

export default function ItemReservationModal() {
  const { session } = useSession();
  const { itemToRequest, setItemToRequest } = useItemContext();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reservationEvent, setReservationEvent] = useState(null);
  const SubmitItemReservation = useSubmitItemReservation();

  const OnSubmitReservation = async (e, selfBooking = false) => {
    e.preventDefault();
    if (startTime === "" || endTime === "") return;
    SubmitItemReservation.mutate(
      {
        user_id: session.user.id,
        item_id: itemToRequest.id,
        start: startTime,
        end: endTime,
        status: selfBooking ? "booking" : "request",
      },
      {
        onSuccess: (data) => {
          setItemToRequest((oldItem) => {
            return {
              ...oldItem,
              item_reservations: [...itemReservations, data],
            };
          });
          setStartTime("");
          setEndTime("");
        },
      }
    );
  };

  useEffect(() => {
    if (startTime !== "" && endTime !== "") {
      setReservationEvent({
        title: "Your reservation",
        start: startTime,
        end: endTime,
        backgroundColor: "green",
        status: "preview",
      });
    } else {
      setReservationEvent(null);
    }
  }, [startTime, endTime]);

  const itemReservations = useMemo(() => {
    if (!itemToRequest) return [];

    return itemToRequest.item_reservations.map((res) => {
      return {
        title:
          "user: " + (res.user_id === session.user.id ? "You" : res.user_id),
        start: res.start,
        end: res.end,
        resId: res.id,
        status: res.status,
        userId: res.user_id,
        backgroundColor:
          res.status === "booking"
            ? "hsla(357, 100%, 64%, 1)"
            : "hsla(40, 100%, 50%, 1)",
      };
    });
  }, [itemToRequest]);

  const SetTime = (time) => {
    if (startTime == "" || endTime != "") {
      setStartTime(time);
      setEndTime("");
    } else {
      const startDate = new Date(startTime);
      let endDate = new Date(time);
      if (endDate <= startDate) {
        time = FormatDateStringAddHalfHour(startDate);
        endDate = new Date(time);
      }
      if (!HasReservationConflict(itemReservations, startDate, endDate))
        setEndTime(time);
      else window.alert("Conflict Exists!");
    }
  };

  const renderEventContent = (arg) => {
    return (
      <EventContent
        arg={arg}
        OnSubmitReservation={OnSubmitReservation}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
      />
    );
  };

  return (
    <div className="fixed bg-blue-950/95 backdrop-blur-md w-[calc(100%-50px)] left-[25px] h-[80%] flex flex-col gap-4">
      <div>{itemToRequest.name}</div>
      <Button text="x" onClick={() => setItemToRequest(null)} />
      {itemToRequest.owner !== session.user.id && (
        <form onSubmit={OnSubmitReservation}>
          <div>Start time: {startTime}</div>
          <div>End time: {endTime}</div>
          <Button
            text="Submit"
            type="submit"
            disabled={SubmitItemReservation.isPending}
          />
        </form>
      )}
      <FullCalendar
        plugins={[interactionPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        eventContent={renderEventContent}
        events={
          reservationEvent
            ? [...itemReservations, reservationEvent]
            : itemReservations
        }
        allDaySlot={false}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "timeGridWeek,timeGridDay", // user can switch between the two
        }}
        height={"80%"}
        selectable={true}
        dateClick={(e) => SetTime(e.dateStr)}
        firstDay={1}
      />
    </div>
  );
}
