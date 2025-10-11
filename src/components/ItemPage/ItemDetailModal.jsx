import Button from "../ui/Button";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { reservationData } from "../../data/reservationData";

export default function ItemDetailModal({ item, onClose }) {
  // find reservations associated to this item
  // render those in calander

  const reservations = reservationData
    .filter((res) => res.itemId === item.id)
    .map((res) => {
      return {
        title: "user: " + res.userId,
        start: res.startDate,
        end: res.endDate,
      };
    });

  return (
    <div className="fixed bg-blue-950/95 backdrop-blur-md w-[calc(100%-50px)] left-[25px] h-screen flex flex-col gap-4">
      <div>{item.name}</div>
      <Button text="x" onClick={onClose} />
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={reservations}
      />
    </div>
  );
}
