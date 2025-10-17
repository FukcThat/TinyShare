import Button from "../ui/Button";
import FullCalendar from "@fullcalendar/react";
import { Reservation } from "../../data/reservationData";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for selectable
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGlobal } from "../../context/useGlobal";
import { FormatDateStringAddHalfHour } from "../../lib/FormatDateStringAddHalfHour";
import { HasReservationConflict } from "../../lib/HasReservationConflict";

export default function ItemReservationModal({ item, onClose }) {
  const {
    user,
    reservations,
    setReservations,
    ApproveReservation,
    DenyReservation,
    CancelReservationRequest,
  } = useGlobal();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reservationEvent, setReservationEvent] = useState(null);

  const OnSubmitReservation = (e, selfBooking = false) => {
    e.preventDefault();

    if (startTime === "" || endTime === "") return;

    const newReservation = new Reservation(
      uuidv4(),
      user.id,
      item.id,
      startTime,
      endTime,
      selfBooking ? "booking" : "request"
    );

    setReservations((oldReservations) => [...oldReservations, newReservation]);
    setStartTime("");
    setEndTime("");
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
    return reservations
      .filter((res) => res.itemId === item.id)
      .map((res) => {
        return {
          title: "user: " + res.userId,
          start: res.startDate,
          end: res.endDate,
          resId: res.id,
          status: res.status,
          userId: res.userId,
          backgroundColor:
            res.status === "booking"
              ? "hsla(357, 100%, 64%, 1)"
              : "hsla(54, 100%, 82%, 1)",
        };
      });
  }, [reservations]);

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

  function EventContent(arg) {
    const displayTime =
      arg.event.timeText || arg.view.calendar.formatIso(arg.event.start);
    return (
      <div className="flex flex-col ">
        <div> {arg.event.title}</div>
        <div>{displayTime}</div>
        {item.owner === user.id &&
          arg.timeText &&
          arg.event._def.extendedProps.status !== "booking" && (
            <div className="flex">
              <Button
                text="✔️"
                onClick={(e) => {
                  if (arg.event._def.extendedProps.status == "preview") {
                    OnSubmitReservation(e, true);
                  } else {
                    ApproveReservation(arg.event._def.extendedProps.resId);
                  }
                }}
              />
              <Button
                text="❌"
                onClick={() => {
                  if (arg.event._def.extendedProps.status == "preview") {
                    setStartTime("");
                    setEndTime("");
                  } else {
                    DenyReservation(arg.event._def.extendedProps.resId);
                  }
                }}
              />
            </div>
          )}
        {arg.event._def.extendedProps.userId == user.id && arg.timeText && (
          <div>
            <Button
              text="Cancel"
              onClick={() => {
                CancelReservationRequest(arg.event._def.extendedProps.resId);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bg-blue-950/95 backdrop-blur-md w-[calc(100%-50px)] left-[25px] h-[80%] flex flex-col gap-4">
      <div>{item.name}</div>
      <Button text="x" onClick={onClose} />
      {item.owner !== user.id && (
        <form onSubmit={OnSubmitReservation}>
          <div>Start time: {startTime}</div>
          <div>End time: {endTime}</div>
          <Button text="Submit" type="submit" />
        </form>
      )}
      <FullCalendar
        plugins={[interactionPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        eventContent={EventContent}
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
