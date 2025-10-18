import { useItemContext } from "../../context/item_context/useItemContext";
import { useGlobal } from "../../context/useGlobal";
import Button from "../ui/Button";

export default function EventContent({
  arg,
  OnSubmitReservation,
  setStartTime,
  setEndTime,
}) {
  const {
    user,
    ApproveReservation,
    DenyReservation,
    CancelReservationRequest,
  } = useGlobal();
  const { itemToRequest } = useItemContext();

  const HandleApproveBtnClick = (e) => {
    if (arg.event._def.extendedProps.status == "preview") {
      OnSubmitReservation(e, true);
    } else {
      ApproveReservation(arg.event._def.extendedProps.resId);
    }
  };

  const HandleDenyBtnClick = () => {
    if (arg.event._def.extendedProps.status == "preview") {
      setStartTime("");
      setEndTime("");
    } else {
      DenyReservation(arg.event._def.extendedProps.resId);
    }
  };

  const HandleCancelBtnClick = () =>
    CancelReservationRequest(arg.event._def.extendedProps.resId);

  // Sets Display Time even on days where its not passed in
  const displayTime =
    arg.event.timeText || arg.view.calendar.formatIso(arg.event.start);

  // Component Helpers
  const IsOwnerAndNotBooked = () =>
    itemToRequest.owner === user.id &&
    arg.event._def.extendedProps.status !== "booking";
  const IsOwnerAndIsBooked = () =>
    itemToRequest.owner === user.id &&
    arg.event._def.extendedProps.status === "booking";

  const IsOurBooking = () =>
    arg.event._def.extendedProps.userId == user.id && arg.timeText;

  return (
    <div className="flex flex-col opacity-0 hover:opacity-100 h-full  ">
      <div> {arg.event.title}</div>
      <div>{displayTime}</div>
      {IsOwnerAndNotBooked() && (
        <div className="flex">
          <Button text="✔️" onClick={HandleApproveBtnClick} />
          <Button text="❌" onClick={HandleDenyBtnClick} />
        </div>
      )}
      {(IsOurBooking() || IsOwnerAndIsBooked()) && (
        <div>
          <Button text="Cancel" onClick={HandleCancelBtnClick} />
        </div>
      )}
    </div>
  );
}
