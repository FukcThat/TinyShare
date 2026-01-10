import { useSession } from '../../context/session_context/useSession';
import Button from '../ui/Button';
import useCancelItemReservation from '../../hooks/tanstack_mutations/useCancelItemReservation';
import useApproveItemReservation from '../../hooks/tanstack_mutations/useApproveItemReservation';
import { useMemo } from 'react';

export default function EventContent({
  arg,
  OnSubmitReservation,
  setStartTime,
  setEndTime,
  item,
}) {
  const { session } = useSession();
  const CancelItemReservation = useCancelItemReservation(item.id);
  const ApproveItemReservation = useApproveItemReservation(item.id);

  const HandleApproveBtnClick = async (e) => {
    if (new Date().getTime() > arg.event.end.getTime()) {
      window.alert('Event is in the past!');
      return;
    }
    if (arg.event._def.extendedProps.status == 'preview') {
      OnSubmitReservation(e, session.user.id === item.owner.id);
    } else {
      ApproveItemReservation.mutate({
        reservationId: arg.event._def.extendedProps.resId,
      });
    }
  };

  const HandleDenyBtnClick = async () => {
    if (new Date().getTime() > arg.event.end.getTime()) {
      window.alert('Event is in the past!');
      return;
    }
    if (arg.event._def.extendedProps.status == 'preview') {
      setStartTime('');
      setEndTime('');
    } else {
      HandleCancelBtnClick();
    }
  };

  const HandleCancelBtnClick = async () => {
    CancelItemReservation.mutate({
      reservationId: arg.event._def.extendedProps.resId,
    });
  };

  const bookingStatus = useMemo(
    () => arg.event._def.extendedProps.status,
    [arg]
  );

  // Sets Display Time even on days where its not passed in
  const displayTime =
    arg.event.timeText || arg.view.calendar.formatIso(arg.event.start);

  // Component Helpers
  const IsOwnerAndNotBooked = () =>
    item.owner.id === session.user.id && bookingStatus !== 'booking';
  const IsOwnerAndIsBooked = () =>
    item.owner.id === session.user.id && bookingStatus === 'booking';

  const IsOurBooking = () =>
    arg.event._def.extendedProps.userId == session.user.id && arg.timeText;

  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <div className="w-full text-start"> {arg.event.title}</div>
      <div className="text-start w-full">
        Starts At {new Date(displayTime).toLocaleTimeString()}
      </div>

      {(bookingStatus === 'preview' || IsOwnerAndNotBooked()) && (
        <div className="flex gap-4">
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
        <div className="flex gap-4">
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
