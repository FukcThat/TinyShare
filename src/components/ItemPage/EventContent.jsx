import { useItemContext } from "../../context/item_context/useItemContext";
import { useSession } from "../../context/session_context/useSession";
import Button from "../ui/Button";
import useCancelItemReservation from "../../hooks/tanstack_mutations/useCancelItemReservation";
import useApproveItemReservation from "../../hooks/tanstack_mutations/useApproveItemReservation";

export default function EventContent({
  arg,
  OnSubmitReservation,
  setStartTime,
  setEndTime,
}) {
  const { session } = useSession();
  const { itemToRequest } = useItemContext();
  const CancelItemReservation = useCancelItemReservation();
  const ApproveItemReservation = useApproveItemReservation();

  const HandleApproveBtnClick = async (e) => {
    if (arg.event._def.extendedProps.status == "preview") {
      OnSubmitReservation(e, true);
    } else {
      ApproveItemReservation.mutate({
        reservationId: arg.event._def.extendedProps.resId,
      });
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
    CancelItemReservation.mutate({
      reservationId: arg.event._def.extendedProps.resId,
    });
  };

  // Sets Display Time even on days where its not passed in
  const displayTime =
    arg.event.timeText || arg.view.calendar.formatIso(arg.event.start);

  // Component Helpers
  const IsOwnerAndNotBooked = () =>
    itemToRequest.owner.id === session.user.id &&
    arg.event._def.extendedProps.status !== "booking";
  const IsOwnerAndIsBooked = () =>
    itemToRequest.owner.id === session.user.id &&
    arg.event._def.extendedProps.status === "booking";

  const IsOurBooking = () =>
    arg.event._def.extendedProps.userId == session.user.id && arg.timeText;

  return (
    <div className="flex flex-col opacity-0 hover:opacity-100 h-full  ">
      <div> {arg.event.title}</div>
      <div>{displayTime}</div>
      {IsOwnerAndNotBooked() && (
        <div className="flex">
          <Button
            disabled={
              ApproveItemReservation.isPending ||
              CancelItemReservation.isPending
            }
            text="✔️"
            onClick={HandleApproveBtnClick}
          />
          <Button
            disabled={
              ApproveItemReservation.isPending ||
              CancelItemReservation.isPending
            }
            text="❌"
            onClick={HandleDenyBtnClick}
          />
        </div>
      )}
      {(IsOurBooking() || IsOwnerAndIsBooked()) && (
        <div>
          <Button
            disabled={
              ApproveItemReservation.isPending ||
              CancelItemReservation.isPending
            }
            text="Cancel"
            onClick={HandleCancelBtnClick}
          />
        </div>
      )}
    </div>
  );
}
