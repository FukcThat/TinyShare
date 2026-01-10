import BgPanel from '../global/BgPanel';
import Button from '../ui/Button';
import useActiveBooking from '../../hooks/useActiveBooking';
// import { useSession } from '../../context/session_context/useSession';

export default function RequestBookingForm({
  // OnSubmitReservation,
  // SubmitItemReservation,
  // start,
  // end,
  item,
}) {
  const { isBooked, end: activeBookingEnd, ownerName } = useActiveBooking(item);
  // const { session } = useSession();

  return (
    <BgPanel>
      <h3 className="w-full text-2xl">📆 Information</h3>
      {isBooked && (
        <div className="flex flex-col w-full bg-orange-300/30 p-4 gap-2 rounded-md border-orange-300 border">
          <p>Currently Booked by {ownerName}</p>
          <p>Available after {activeBookingEnd}</p>
        </div>
      )}
      {/* <form
        onSubmit={(e) =>
          OnSubmitReservation(e, item.owner.id === session.user.id)
        }
        className="flex flex-col gap-2"
      >
        <div>Start time: {start}</div>
        <div>End time: {end}</div>
        <Button
          text="Submit"
          type="submit"
          disabled={SubmitItemReservation.isPending}
        />
      </form> */}
      <div className="border-t border-accent w-full py-4">
        <h4 className="text-lg font-bold">Guidelines</h4>
        <ul className="flex flex-col gap-2 mt-4 text-text-primary/85 text-sm">
          <li>• Return items in the same condition</li>
          <li>• Respect booking times</li>
          <li>• Contact owner for extensions</li>
          <li>• Report any damage immediately</li>
        </ul>
      </div>
    </BgPanel>
  );
}
