import BgPanel from '../global/BgPanel';
import useActiveBooking from '../../hooks/useActiveBooking';
import HeaderText from '../ui/Text/HeaderText';
import SubContentText from '../ui/Text/SubContentText';
import ContentText from '../ui/Text/ContentText';
import FadedText from '../ui/Text/FadedText';

const Guidelines = [
  '• Return items in the same condition',
  '• Respect booking times',
  '• Contact owner for extensions',
  '• Report any damage immediately',
];

export default function RequestBookingForm({ item }) {
  const { isBooked, end: activeBookingEnd, ownerName } = useActiveBooking(item);

  return (
    <BgPanel>
      <HeaderText text="📆 Information" />
      {isBooked && (
        <div className="flex flex-col w-full bg-orange-300/30 p-4 gap-2 rounded-md border-orange-300 border">
          <SubContentText text={`Currently Booked by ${ownerName}`} />
          <SubContentText text={`Available after ${activeBookingEnd}`} />
        </div>
      )}
      <div className="border-t border-accent w-full py-4">
        <ContentText styles="font-bold" text="Guidelines" />
        <ul className="flex flex-col gap-2 mt-4 text-text-primary/85 text-sm">
          {Guidelines.map((g) => (
            <FadedText key={g} styles="text-text-primary" text={g} />
          ))}
        </ul>
      </div>
    </BgPanel>
  );
}
