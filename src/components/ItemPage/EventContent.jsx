export default function EventContent(arg) {
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
              onClick={() =>
                ApproveReservation(arg.event._def.extendedProps.resId)
              }
            />
            <Button
              text="❌"
              onClick={() =>
                DenyReservation(arg.event._def.extendedProps.resId)
              }
            />
          </div>
        )}
    </div>
  );
}
