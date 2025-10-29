import { reservationsApi } from "../../../mocks";
import { useItemContext } from "../../context/item_context/useItemContext";
import { useSession } from "../../context/session_context/useSession";
import { useGlobal } from "../../context/useGlobal";
import Button from "../ui/Button";

export default function EventContent({
  arg,
  OnSubmitReservation,
  setStartTime,
  setEndTime,
}) {
  const { user } = useSession();
  const { setReservations } = useGlobal();
  const { itemToRequest } = useItemContext();

  const HandleApproveBtnClick = async (e) => {
    if (arg.event._def.extendedProps.status == "preview") {
      OnSubmitReservation(e, true);
    } else {
      try {
        const res = await reservationsApi.approveReservation(
          arg.event._def.extendedProps.resId
        );
        if (!res.ok) throw new Error("Approve Reservation failed: ", res);

        setReservations((oldReservations) =>
          oldReservations.map((reservation) =>
            res.updatedReservation.id != reservation.id
              ? reservation
              : res.updatedReservation
          )
        );
      } catch (error) {
        console.error(error);
      }
    }
  };

  const HandleDenyBtnClick = async () => {
    if (arg.event._def.extendedProps.status == "preview") {
      setStartTime("");
      setEndTime("");
    } else {
      HandleCancelBtnClick();
    }
  };

  const HandleCancelBtnClick = async () => {
    try {
      const res = await reservationsApi.cancelReservation(
        arg.event._def.extendedProps.resId
      );

      console.log(res);
      if (!res.ok) throw new Error("Deny reservation error: ", res);

      setReservations((oldReservations) =>
        oldReservations.filter(
          (reservation) => reservation.id != arg.event._def.extendedProps.resId
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

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
